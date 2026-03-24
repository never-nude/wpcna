const sitePathPrefix = process.env.SITE_PATH_PREFIX || "/";
const deployBaseUrl = process.env.SITE_BASE_URL || "http://localhost:8080";
const cleanPrefix = sitePathPrefix === "/" ? "" : sitePathPrefix.replace(/\/$/, "");

module.exports = {
  name: "White Plains Council of Neighborhood Associations",
  shortName: "WPCNA",
  tagline: "Neighborhood voices, local events, and civic connection across White Plains.",
  baseUrl: `${deployBaseUrl.replace(/\/$/, "")}${cleanPrefix}`,
  pathPrefix: sitePathPrefix,
  contactName: "Michael Dalton, President",
  email: "michael@mdalton.com",
  location: "White Plains, New York, United States",
  currentSiteUrl: "https://wp-cna.org/",
  defaultOgImage: "/assets/img/og-default.svg",
  mission:
    "WPCNA connects neighborhood associations and residents across White Plains by highlighting civic meetings, community gatherings, workshops, and local events that strengthen participation in city life.",
  meetingNote:
    "WPCNA meetings are typically held on the second Tuesday of the month at 7:00 p.m. Agenda details are shared as they are confirmed.",
  communityChannels: [
    {
      label: "White Plains BID Instagram",
      url: "https://www.instagram.com/whiteplains.bid/"
    },
    {
      label: "White Plains Public Library Calendar",
      url: "https://calendar.whiteplainslibrary.org/"
    },
    {
      label: "City of White Plains Calendar",
      url: "https://www.cityofwhiteplains.com/Calendar.aspx"
    }
  ]
};
