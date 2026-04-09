# Neighborhood photos — follow-up

## What got done in this pass

Seven of the 30 `status: "generated"` entries were replaced with real historical photographs sourced from *Picturesque White Plains* (John Rösch, 1902), a public-domain illustrated book digitized by the Library of Congress and hosted on Internet Archive:

- https://archive.org/details/picturesquewhite00rs

Crops were taken from the 2400px page scans, resized to ~1600px wide, re-saved as JPEG q=82.

| Slug | Source plate (book page caption) | Book page |
|---|---|---|
| `hillair-circle` | "View from Hillair" | n6 |
| `rocky-dell` | "Rocky Dell. Residence of N.C. Reynal." | n15 |
| `gedney-farms` | "Gedney Farm. Residence of Howard Willets." | n18 |
| `fisher-hill` | "Fisher Avenue, South." | n30 |
| `highlands` | "View from Chatterton Hill." | n44 |
| `kirkbride-asylum` | "Bloomingdale." (Bloomingdale Hospital campus) | n47 |
| `white-plains-reservoir` | "St. Mary's Lake and the New Reservoir" (central oval) | n13 |

All seven now have `status: "photo"` in `src/_data/neighborhood-heroes.json`, with `John Rösch` as photographer, `Public domain` license, and a book-level source/attribution URL.

## Still on generated SVGs (23 remaining)

These were searched across Wikimedia Commons, Library of Congress (PPOC, HABS/HAER, Gottscho-Schleisner), Internet Archive, NYPL Digital Collections, and the *Picturesque White Plains* 1902 book. Nothing that specifically depicts these neighborhoods came up under a free license.

- `fulton-street`
- `ferris-avenue`
- `prospect-park`
- `westminster-ridge`
- `woodcrest-heights`
- `eastview`
- `old-oak-ridge`
- `old-mamaroneck-road`
- `bryant-gardens`
- `havilands-manor`
- `north-street`
- `gedney-park`
- `gedney-circle`
- `gedney-commons`
- `gedney-manor`
- `gedney-meadows`
- `brook-hills`
- `holbrooke`
- `reynal-park`
- `colonial-corners`
- `soundview`
- `rosedale`
- `idle-forest`

### Partial leads worth a second pass

- **`north-street`** — The LOC Gottscho-Schleisner collection has a 5-photo series of the First Baptist Church on North Street from August 1962, rights: LOC "no known restrictions." The catch is that the master TIFFs in LOC's storage are only ~340×420 px (contact-print scans), not 1600px as needed. If a better scan shows up on Commons later, this would work. Item: https://www.loc.gov/item/2018732801/
- **`bryant-gardens`** — Built 1950–52, so no pre-1929 public-domain shortcut. Would need either CC-licensed modern photography or an explicit NRHP / HABS entry (none found).
- **`gedney-farms` bonus** — A second PD source exists for the more famous 1912 Gedney Farm Hotel (which burned in 1924): the December 10, 1913 issue of *American Architect* Vol. 104 on HathiTrust (https://babel.hathitrust.org/cgi/pt?id=uc1.d0002613669) published architectural photographs of the hotel designed by Kenneth M. Murchison. The hotel is the *other* namesake of the neighborhood, so the current 1902 "Gedney Farm residence" plate could be swapped or supplemented if a better hotel scan is extracted.
- **`north-white-plains` / station proxy for `eastview`** — HABS NY-6294 (North White Plains Railroad Station, Fisher Street west of North Broadway) has four high-res photos, PD: https://www.loc.gov/item/ny1580/. Usable if we decide a historic station image is a reasonable proxy for Eastview (itself a former station on the same Harlem Branch line). Not used here because the station is not literally in Eastview.
- **`white-plains-reservoir` alternate** — Commons has an 1880 LOC map "Silver Lake Park, on St Mary's Lake, White Plains, New York" (https://commons.wikimedia.org/wiki/File:Silver_Lake_Park,_on_St_Mary%27s_Lake,_White_Plains,_New_York_LOC_2010594192.jpg, 9403×6371, PD) — the Silver Lake area *is* the White Plains Reservoir. A cartographic rather than photographic hero, but it would be the earliest-known depiction if wanted.

### Next steps if anyone picks this up

1. Original photography. For the mid-20th-century subdivisions (Hillair, Reynal, Colonial Corners, etc.), the realistic path is modern photos taken and released under CC by a WPCNA member. A single sunny afternoon walk through each neighborhood would yield enough street scenes to close the gap.
2. Check the Westchester County Historical Society's PastPerfect online catalog (https://westchester.pastperfectonline.com/) — they have lots of historic Gedney / north-side material. Licenses are per-item and mostly unclear, but a direct email to the society about use in a non-commercial civic site may get a yes.
3. Browse the full 202-file Gottscho-Schleisner White Plains subcategory on Commons (https://commons.wikimedia.org/wiki/Category:Gottscho-Schleisner_Collection_images_of_White_Plains,_New_York) for anything that maps to a specific neighborhood the 1902 book missed.
