# Image Sourcing Notes

This file documents the imagery currently used in the WPCNA site refresh and explains which assets are placeholders.

## Rights-Clear White Plains Photography

### Homepage hero and about page image

- File: `src/assets/img/photos/white-plains-main.jpeg`
- Source: user-provided local image
- Original file: `/Users/michael/Desktop/white plains (1).jpeg`
- Notes: Copied into the project for the current hero and about image on March 25, 2026, replacing the earlier local version.

### Alternate Rights-Clear White Plains Photography

These assets remain in the project and can be reused later, but they are not the current featured hero:

- File: `src/assets/img/photos/white-plains-downtown-street.jpg`
- Source page: <https://commons.wikimedia.org/wiki/File:Downtown_White_Plains,_NY_2010-05-20.jpg>
- Title: `Downtown White Plains, NY 2010-05-20`
- Creator: `Paul Sableman`
- License: `CC BY 2.0`
- Notes: Downloaded from Wikimedia Commons and resized locally for site use.

- File: `src/assets/img/photos/white-plains-downtown-hero.jpg`
- Source page: <https://commons.wikimedia.org/wiki/File:Downtown_White_Plains_from_the_NE.jpg>
- Title: `Downtown White Plains from the NE`
- Creator: `Ynsalh`
- License: `CC BY-SA 4.0`

- File: `src/assets/img/photos/white-plains-station.jpg`
- Source page: <https://commons.wikimedia.org/wiki/File:White_Plains_MNRR_Station%3B_2018-10-16%3B_02.jpg>
- Title: `White Plains MNRR Station; 2018-10-16; 02`
- Creator: `DanTD`
- License: `CC BY-SA 4.0`

## Neighborhood Placeholder Graphics

The homepage neighborhood section currently uses locally created placeholder graphics:

- `src/assets/img/neighborhoods/fisher-hill.svg`
- `src/assets/img/neighborhoods/the-highlands.svg`
- `src/assets/img/neighborhoods/gedney-farms.svg`
- `src/assets/img/neighborhoods/rosedale.svg`

These are intentionally temporary. They avoid using uncertain or copyrighted real-estate photography while keeping the layout ready for future neighborhood-specific imagery.

## Replacement Workflow

1. Source a neighborhood image with clearly reusable rights.
2. Save it under `src/assets/img/neighborhoods/`.
3. Update the corresponding item in `src/_data/neighborhoods.json`.
4. Replace the placeholder entry in this file with the real attribution details.
