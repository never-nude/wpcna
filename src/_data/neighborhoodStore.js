const neighborhoods = require("./neighborhoods");
const neighborhoodHeroes = require("./neighborhood-heroes.json");

const groupDescriptions = {
  "Central White Plains":
    "The city's core, where Downtown, civic buildings, transit, and close-in residential blocks meet.",
  "West Side and Near-Downtown Neighborhoods":
    "Residential areas west of the center, plus nearby blocks that stay closely tied to Downtown.",
  "North and Northeast":
    "Neighborhoods north and east of the center, ranging from prominent corridors to quieter hillside pockets.",
  "East Side and Institutional Anchors":
    "East-side neighborhoods shaped by longtime roads, campuses, and landmark institutions.",
  "Gedney and the South Side":
    "The south side of White Plains, including the Gedney neighborhoods and other established residential pockets."
};

const groupOrientationNotes = {
  "Central White Plains":
    "This part of White Plains is where the city feels most concentrated, with public buildings, major streets, and close-in residential blocks all close together.",
  "West Side and Near-Downtown Neighborhoods":
    "This part of White Plains sits close to the center while keeping a more residential feel, especially on the west side and the blocks just beyond Downtown.",
  "North and Northeast":
    "This part of White Plains stretches north and northeast from the center, mixing major corridors with quieter hillside and residential areas.",
  "East Side and Institutional Anchors":
    "This part of White Plains is shaped by long-established roads, campuses, and institutions alongside residential neighborhoods.",
  "Gedney and the South Side":
    "This part of White Plains covers the Gedney area and the south side, where many neighborhoods feel greener, calmer, and more residential than the city center."
};

const referencePhrases = [
  "Metro-North station",
  "Mamaroneck Avenue",
  "White Plains Hospital",
  "Brookfield Commons",
  "Battle of White Plains",
  "Dusenbury Hill",
  "North Broadway",
  "Good Counsel Complex",
  "White Plains Reservoir",
  "Westchester Avenue",
  "Old Mamaroneck Road",
  "Burke campus",
  "Saxon Woods Park",
  "golf course",
  "recreation areas",
  "trails",
  "pool",
  "Downtown",
  "City Hall"
];

const toKebab = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function firstSentence(text = "") {
  const match = String(text).trim().match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : String(text).trim();
}

function splitSentences(text = "") {
  const matches = String(text)
    .trim()
    .match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);

  return matches ? matches.map((sentence) => sentence.trim()).filter(Boolean) : [];
}

function extractReferencePoints(description = "") {
  const lowerDescription = description.toLowerCase();

  return referencePhrases.filter((phrase) => lowerDescription.includes(phrase.toLowerCase()));
}

const heroBySlug = Object.fromEntries(
  neighborhoodHeroes
    .map((hero) => [
      hero.slug,
      {
        ...hero,
        imagePath: `/assets/img/neighborhoods/${hero.localFilename}`,
        cardImagePath: hero.cardLocalFilename
          ? `/assets/img/neighborhoods/${hero.cardLocalFilename}`
          : `/assets/img/neighborhoods/${hero.localFilename}`,
        cardAltText: hero.cardAltText || hero.altText
      }
    ])
);

const baseNeighborhoods = neighborhoods.map((item, index) => {
  const groupSlug = toKebab(item.group);
  const detailUrl = `/neighborhoods/${item.slug}/`;
  const sentences = splitSentences(item.description);
  const words = item.name.match(/[A-Z0-9][a-z0-9]*/g) || item.name.split(/\s+/);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const referencePoints = extractReferencePoints(item.description).filter(
    (phrase) => phrase.toLowerCase() !== item.name.toLowerCase()
  );
  const cardContext = referencePoints.slice(0, 2).join(" • ");
  const detailParagraphs = sentences.length > 1 ? sentences.slice(1) : [item.description];

  return {
    ...item,
    index,
    groupSlug,
    groupDescription: groupDescriptions[item.group] || "",
    orientationNote: groupOrientationNotes[item.group] || "",
    hero: heroBySlug[item.slug] || null,
    detailUrl,
    teaser: sentences[0] || firstSentence(item.description),
    detailParagraphs,
    metaDescription: `Learn about ${item.name}, part of ${item.group}.`,
    initials,
    referencePoints,
    cardContext
  };
});

const groups = [];
const groupMap = new Map();

baseNeighborhoods.forEach((neighborhood) => {
  if (!groupMap.has(neighborhood.group)) {
    const group = {
      name: neighborhood.group,
      slug: neighborhood.groupSlug,
      description: neighborhood.groupDescription,
      neighborhoods: []
    };

    groupMap.set(neighborhood.group, group);
    groups.push(group);
  }

  groupMap.get(neighborhood.group).neighborhoods.push(neighborhood);
});

const all = baseNeighborhoods.map((neighborhood) => {
  const group = groupMap.get(neighborhood.group);
  const relatedNeighborhoods = group.neighborhoods
    .filter((candidate) => candidate.slug !== neighborhood.slug)
    .slice(0, 4)
    .map(({ name, slug, detailUrl }) => ({ name, slug, detailUrl }));

  return {
    ...neighborhood,
    relatedNeighborhoods
  };
});

const bySlug = Object.fromEntries(all.map((neighborhood) => [neighborhood.slug, neighborhood]));

module.exports = {
  count: all.length,
  all,
  groups,
  bySlug
};
