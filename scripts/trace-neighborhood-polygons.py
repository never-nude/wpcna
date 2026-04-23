#!/usr/bin/env python3
"""Auto-trace neighborhood polygons from the static WPCNA map.

Strategy:
  1. For each neighborhood, define the (x, y) center of its text label on the
     1856 x 2560 source map image. These are hand-recorded from the tiled
     grid views in /tmp/maptiles.
  2. Flood-fill the color-connected region at each label to find its color
     cluster. Multiple neighborhoods may share a cluster.
  3. Within each cluster, Voronoi-partition the cluster mask by the label
     centroids. Each partition becomes that neighborhood's mask.
  4. Extract the contour of each per-neighborhood mask via marching squares.
  5. Simplify with Ramer-Douglas-Peucker to land in the 20-60 point range.
  6. Emit a JSON file of slug -> list of (x, y) pixel coordinates.

The script also renders a verification overlay so each polygon can be
reviewed on the source map.
"""
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from scipy import ndimage
from skimage import measure
import json
import os

SRC = '/tmp/wp-neighborhood-map.png'
OUT_JSON = '/Users/michael/wpcna/src/_data/neighborhoodPolygons.json'
OVERLAY = '/tmp/polygon_overlay.jpg'
REVIEW_DIR = '/tmp/polygon_review'
os.makedirs(REVIEW_DIR, exist_ok=True)

# Color classes used to define a neighborhood fill.
COLOR_CLASSES = [
    ([200, 100, 90], [255, 180, 150]),  # salmon
    ([70, 160, 140], [150, 210, 180]),  # teal
    ([60, 90, 90],   [110, 130, 130]),  # dark green
    ([160, 160, 140],[210, 210, 200]),  # light grey
    ([140, 180, 200],[200, 230, 240]),  # blue grey (Woodcrest)
    ([195, 150, 130],[235, 185, 170]),  # tan salmon (North Street)
]

# Label positions read from the tiled grid views (source image pixels).
# Each entry points to the visible centroid of the neighborhood's name text.
LABELS = {
    # Central downtown & near-downtown
    'downtown':               (700, 1130),  # Urban Core label on the map
    'church-street':          (635, 985),
    'government-center':      (630, 1200),
    'winbrook':               (635, 1260),
    'health-center':          (635, 1310),
    'gateway':                (650, 1370),
    'battle-hill':            (470, 1195),
    'fisher-hill':            (515, 1315),
    'highlands':              (560, 1510),
    'fulton-street':          (345, 1080),
    'ferris-avenue':          (550, 870),
    'bronx-river':            (555, 985),
    'prospect-park':          (470, 1580),
    'north-broadway':         (640, 730),
    'good-counsel':           (765, 900),
    'westminster-ridge':      (785, 820),
    'woodcrest-heights':      (950, 830),
    'white-plains-reservoir': (800, 480),
    'eastview':               (870, 1080),
    'old-oak-ridge':          (1070, 1300),
    'westchester-avenue':     (1380, 1525),
    'old-mamaroneck-road':    (700, 1395),
    'kirkbride-asylum':       (930, 1320),
    'bryant-gardens':         (870, 1470),
    'burke-institute':        (940, 1530),
    'havilands-manor':        (1250, 1560),
    'north-street':           (1130, 1745),
    'gedney-park':            (685, 1580),
    'gedney-farms':           (950, 1665),
    'gedney-circle':          (820, 1715),
    'gedney-commons':         (830, 1820),
    'gedney-manor':           (665, 1735),
    'gedney-meadows':         (910, 1880),
    'brook-hills':            (985, 1955),
    'holbrooke':              (885, 1865),
    'reynal-park':            (720, 1960),
    'hillair-circle':         (810, 2050),
    'colonial-corners':       (585, 1850),
    'rocky-dell':             (625, 1895),
    'soundview':              (720, 1770),
    'rosedale':               (1140, 2120),
    'saxon-woods':            (950, 2100),
    'idle-forest':            (565, 1735),
}


def build_color_masks(img):
    """Precompute closed-and-opened masks per color class, once."""
    masks = []
    for lo, hi in COLOR_CLASSES:
        raw = np.all((img >= np.array(lo)) & (img <= np.array(hi)), axis=2)
        # Closing bridges text gaps; opening removes thin noise. Both are
        # needed — together they give stable neighborhood-sized components.
        closed = ndimage.binary_closing(raw, iterations=6)
        opened = ndimage.binary_opening(closed, iterations=2)
        labeled, _ = ndimage.label(opened)
        masks.append((labeled, raw))
    return masks


def find_cluster_mask(img, seed_x, seed_y, precomputed=None):
    """Return a bool mask of the color-connected cluster for (x,y).

    Strategy:
      - For each color class, find the largest component within 80 px of the
        seed in the closed+opened labeling.
      - Pick the color class whose best component is largest overall. This
        handles the case where the seed lands on black label text (pixel
        color doesn't match any class) or in a small artifact pocket.
    """
    h, w, _ = img.shape
    if precomputed is None:
        precomputed = build_color_masks(img)
    y0, y1 = max(0, seed_y - 80), min(h, seed_y + 80)
    x0, x1 = max(0, seed_x - 80), min(w, seed_x + 80)
    best_mask, best_size = None, 0
    for labeled, raw in precomputed:
        # Any label touching the 80-px window?
        window = labeled[y0:y1, x0:x1]
        present = np.unique(window)
        present = present[present > 0]
        if len(present) == 0:
            continue
        # Score each candidate label by total size
        for lab in present:
            sz = int((labeled == lab).sum())
            # Skip tiny noise blobs
            if sz < 2000:
                continue
            if sz > best_size:
                best_size = sz
                best_mask = (labeled == lab)
    return best_mask


def voronoi_partition(mask, seeds):
    """Assign each mask pixel to the nearest seed. Returns dict slug -> mask."""
    ys, xs = np.where(mask)
    if len(ys) == 0:
        return {s[0]: np.zeros_like(mask) for s in seeds}
    pts = np.stack([xs, ys], axis=1)
    arr = np.array([[sx, sy] for (_, sx, sy) in seeds])
    # For huge clusters, do a KD-tree lookup via scipy
    from scipy.spatial import cKDTree
    tree = cKDTree(arr)
    _, nearest = tree.query(pts)
    out = {}
    for i, (slug, _, _) in enumerate(seeds):
        sub = np.zeros_like(mask)
        sel = nearest == i
        sub[ys[sel], xs[sel]] = True
        out[slug] = sub
    return out


def rdp(points, eps):
    points = np.array(points, dtype=float)
    if len(points) < 3:
        return points.tolist()
    start, end = points[0], points[-1]
    line = end - start
    line_len = float(np.linalg.norm(line))
    if line_len == 0:
        distances = np.linalg.norm(points - start, axis=1)
    else:
        d = points - start
        cross = line[0] * d[:, 1] - line[1] * d[:, 0]
        distances = np.abs(cross) / line_len
    idx = int(distances.argmax())
    if distances[idx] > eps:
        left = rdp(points[:idx + 1], eps)
        right = rdp(points[idx:], eps)
        return left[:-1] + right
    return [points[0].tolist(), points[-1].tolist()]


def contour_of(mask, eps=4.0, min_points=20, max_points=60):
    contours = measure.find_contours(mask.astype(float), 0.5)
    if not contours:
        return []
    contours.sort(key=len, reverse=True)
    # Try successive simplification tolerances to hit the desired point range
    for candidate_eps in [eps, eps * 0.7, eps * 0.5, eps * 0.35, eps * 0.25]:
        simp = rdp(contours[0], candidate_eps)
        if len(simp) >= min_points:
            break
    # Clamp max
    if len(simp) > max_points:
        # Force higher tolerance
        lo_e, hi_e = eps, eps * 4
        for _ in range(10):
            m = (lo_e + hi_e) / 2
            simp = rdp(contours[0], m)
            if len(simp) > max_points:
                lo_e = m
            else:
                hi_e = m
    pts = [(int(round(p[1])), int(round(p[0]))) for p in simp]
    # Dedupe while preserving order
    seen = set()
    clean = []
    for p in pts:
        if p not in seen:
            clean.append(p)
            seen.add(p)
    return clean


def build_city_mask(img):
    """Return a boolean mask covering all colored 'land' inside the city
    polygon. Any pixel matching any neighborhood fill color class counts.
    """
    h, w, _ = img.shape
    land = np.zeros((h, w), dtype=bool)
    for lo, hi in COLOR_CLASSES:
        land |= np.all((img >= np.array(lo)) & (img <= np.array(hi)), axis=2)
    # Close to bridge text + small gaps
    land = ndimage.binary_closing(land, iterations=8)
    # Open to drop thin stray noise
    land = ndimage.binary_opening(land, iterations=2)
    # Keep only the biggest connected component (the city body)
    labeled, n = ndimage.label(land)
    if n == 0:
        return land
    sizes = ndimage.sum(land, labeled, range(1, n + 1))
    biggest = int(sizes.argmax()) + 1
    return labeled == biggest


def main():
    img_pil = Image.open(SRC).convert('RGB')
    img = np.array(img_pil)

    # Build one big city-land mask containing every neighborhood fill.
    city = build_city_mask(img)
    print(f'city mask: {int(city.sum())} pixels')

    # Voronoi-partition the entire city by the 43 label centroids.
    seeds = [(slug, x, y) for slug, (x, y) in LABELS.items()]
    parts = voronoi_partition(city, seeds)

    polygons = {}
    for slug, sub in parts.items():
        polygons[slug] = contour_of(sub)

    # Render full overlay
    out = img_pil.copy()
    draw = ImageDraw.Draw(out, 'RGBA')
    palette = [
        (255, 107, 53, 85), (53, 180, 255, 85), (255, 220, 53, 85),
        (120, 255, 53, 85), (255, 53, 180, 85), (53, 255, 220, 85),
        (200, 53, 255, 85),
    ]
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 16)
    except Exception:
        font = ImageFont.load_default()
    for i, (slug, pts) in enumerate(sorted(polygons.items())):
        if len(pts) < 3:
            continue
        draw.polygon(pts, fill=palette[i % len(palette)], outline=(0, 0, 0))
        cx = sum(p[0] for p in pts) / len(pts)
        cy = sum(p[1] for p in pts) / len(pts)
        draw.text((cx - 20, cy - 6), f'{len(pts)}', fill=(0, 0, 0), font=font)
    out.thumbnail((1500, 2000))
    out.save(OVERLAY, quality=85)
    print(f'overlay saved: {OVERLAY}')

    # Write JSON
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, 'w') as f:
        json.dump({
            'imageWidth': img.shape[1],
            'imageHeight': img.shape[0],
            'polygons': polygons,
        }, f, indent=2)
    print(f'wrote {OUT_JSON} with {len(polygons)} polygons')

    # Per-slug review crops
    for slug, pts in polygons.items():
        if not pts or len(pts) < 3:
            continue
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        pad = 100
        box = (max(0, min(xs) - pad), max(0, min(ys) - pad),
               min(img.shape[1], max(xs) + pad), min(img.shape[0], max(ys) + pad))
        crop = img_pil.crop(box).convert('RGB')
        d2 = ImageDraw.Draw(crop, 'RGBA')
        local = [(x - box[0], y - box[1]) for (x, y) in pts]
        d2.polygon(local, fill=(255, 107, 53, 95), outline=(255, 40, 0))
        for lx, ly in local:
            d2.ellipse([lx - 4, ly - 4, lx + 4, ly + 4], fill=(255, 255, 0), outline=(0, 0, 0))
        d2.text((10, 10), f'{slug} ({len(pts)} pts)', fill=(0, 0, 0), font=font)
        crop.save(os.path.join(REVIEW_DIR, f'{slug}.jpg'), quality=85)

    # Point-count summary
    counts = sorted(((len(p), s) for s, p in polygons.items()), reverse=True)
    for n, s in counts:
        print(f'  {s:28} {n:3} pts')


if __name__ == '__main__':
    main()
