const events = require("./events.json");

function scoreRelated(baseEvent, candidate) {
  let score = 0;

  if (baseEvent.category === candidate.category) {
    score += 4;
  }

  const sharedTags = candidate.tags.filter((tag) => baseEvent.tags.includes(tag));
  score += sharedTags.length;

  if (baseEvent.organizer === candidate.organizer) {
    score += 2;
  }

  if (baseEvent.status === candidate.status) {
    score += 1;
  }

  return score;
}

function buildPrimaryAction(event) {
  if (event.externalUrl) {
    return {
      label: event.ctaLabel || "Learn more",
      url: event.externalUrl
    };
  }

  if (event.flyerPdf) {
    return {
      label: event.ctaLabel || "Download flyer",
      url: event.flyerPdf
    };
  }

  return null;
}

function buildSecondaryLinks(event) {
  const links = [];

  if (event.flyerPdf && event.flyerPdf !== event.externalUrl) {
    links.push({
      label: "Flyer / PDF",
      url: event.flyerPdf
    });
  }

  if (event.sourceUrl && event.sourceUrl !== event.externalUrl) {
    links.push({
      label: event.sourceLabel || "Source",
      url: event.sourceUrl
    });
  }

  return links;
}

function compareUpcoming(a, b) {
  return `${a.startDate}${a.startTime || "00:00"}`.localeCompare(`${b.startDate}${b.startTime || "00:00"}`);
}

function comparePast(a, b) {
  return `${b.startDate}${b.startTime || "00:00"}`.localeCompare(`${a.startDate}${a.startTime || "00:00"}`);
}

const all = events.map((event) => ({
  ...event,
  detailUrl: `/events/${event.slug}/`,
  primaryAction: buildPrimaryAction(event),
  secondaryLinks: buildSecondaryLinks(event),
  monthKey: event.startDate.slice(0, 7),
  searchText: [
    event.title,
    event.category,
    event.organizer,
    event.shortSummary,
    event.locationName,
    event.locationAddress,
    ...(event.tags || [])
  ]
    .join(" ")
    .toLowerCase()
}));

const upcoming = all.filter((event) => event.status === "upcoming").sort(compareUpcoming);
const past = all.filter((event) => event.status === "past").sort(comparePast);

const bySlug = new Map(all.map((event) => [event.slug, event]));

for (const event of all) {
  event.relatedEvents = all
    .filter((candidate) => candidate.slug !== event.slug)
    .map((candidate) => ({
      candidate,
      score: scoreRelated(event, candidate)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return compareUpcoming(a.candidate, b.candidate);
    })
    .slice(0, 3)
    .map((entry) => entry.candidate);
}

const categories = [...new Set(all.map((event) => event.category))].sort();
const months = [...new Set(all.map((event) => event.monthKey))].sort();

const featuredUpcoming = upcoming.filter((event) => event.featured);
const featuredPast = past.filter((event) => event.featured);
const homeUpcoming = (featuredUpcoming.length ? featuredUpcoming : upcoming).slice(0, 4);
const homePast = (featuredPast.length ? featuredPast : past).slice(0, 4);

module.exports = {
  all,
  bySlug,
  upcoming,
  past,
  categories,
  months,
  homeUpcoming,
  homePast
};
