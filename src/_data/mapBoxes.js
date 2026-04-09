// Bounding boxes for each neighborhood on the static neighborhood map image.
// Coordinates are in source-image pixels on /assets/img/neighborhood-map.png
// (1856 × 2560). These are approximate visual estimates read directly from the
// labeled polygons on the map; adjust values here to fine-tune highlight
// placement. Format: [x, y, width, height].
module.exports = {
  imageWidth: 1856,
  imageHeight: 2560,
  boxes: {
    // North & reservoir area
    "white-plains-reservoir": [640, 240, 320, 440],
    "north-broadway":         [520, 600, 220, 300],
    "westminster-ridge":      [720, 640, 200, 220],
    "woodcrest-heights":      [860, 720, 240, 240],
    "good-counsel":           [660, 760, 220, 200],
    "ferris-avenue":          [400, 820, 200, 220],
    "bronx-river":             [420, 880, 240, 220],
    "fulton-street":           [260, 940, 220, 220],
    "church-street":           [540, 920, 220, 160],
    "eastview":                [780, 960, 260, 260],

    // Central / Downtown cluster
    "battle-hill":             [340, 1080, 260, 220],
    "urban-core":              [580, 1080, 240, 140], // not a slug, placeholder
    "downtown":                [580, 1080, 240, 140],
    "government-center":       [560, 1160, 220, 120],
    "winbrook":                [580, 1200, 200, 100],
    "health-center":           [600, 1240, 200, 100],
    "gateway":                 [540, 1280, 220, 100],
    "fisher-hill":             [400, 1220, 200, 140],
    "kirkbride-asylum":        [790, 1200, 280, 220],
    "old-oak-ridge":           [960, 1180, 260, 240],

    // East / Westchester Avenue corridor
    "westchester-avenue":      [1100, 1280, 680, 400],

    // South / Gedney cluster
    "old-mamaroneck-road":     [520, 1320, 280, 120],
    "highlands":               [420, 1400, 280, 220],
    "bryant-gardens":          [780, 1420, 180, 100],
    "burke-institute":         [840, 1470, 160, 100],
    "havilands-manor":         [1060, 1500, 280, 220],
    "prospect-park":           [300, 1520, 240, 260],
    "gedney-park":             [540, 1540, 260, 200],
    "gedney-farms":            [720, 1580, 280, 280],
    "north-street":            [880, 1660, 360, 320],

    // South interior
    "idle-forest":             [340, 1720, 200, 160],
    "gedney-manor":            [440, 1720, 200, 120],
    "gedney-circle":           [640, 1720, 180, 120],
    "soundview":               [280, 1780, 200, 140],
    "colonial-corners":        [440, 1800, 220, 140],
    "holbrooke":               [700, 1800, 180, 120],
    "gedney-commons":          [600, 1790, 200, 100],
    "gedney-meadows":          [800, 1840, 240, 180],
    "brook-hills":             [860, 1900, 200, 160],
    "rocky-dell":              [400, 1860, 240, 160],
    "reynal-park":             [560, 1900, 220, 180],

    // Far south
    "hillair-circle":          [460, 1980, 300, 180],
    "saxon-woods":             [600, 2120, 280, 180],
    "rosedale":                [800, 2050, 280, 260]
  }
};
