const sitePathPrefix = process.env.SITE_PATH_PREFIX || "/";
const deployBaseUrl = process.env.SITE_BASE_URL || "http://localhost:8080";
const cleanPrefix = sitePathPrefix === "/" ? "" : sitePathPrefix.replace(/\/$/, "");

module.exports = {
  name: "White Plains Council of Neighborhood Associations",
  shortName: "WPCNA",
  tagline: "Events and neighborhood updates around White Plains.",
  baseUrl: `${deployBaseUrl.replace(/\/$/, "")}${cleanPrefix}`,
  pathPrefix: sitePathPrefix,
  contactName: "Michael Dalton, President",
  email: "michael@mdalton.com",
  location: "White Plains, New York, United States",
  currentSiteUrl: "https://wp-cna.org/",
  defaultOgImage: "/assets/img/photos/white-plains-main.jpeg",
  heroImage: "/assets/img/photos/white-plains-main.jpeg",
  heroImageAlt: "Aerial view of downtown White Plains with high-rise buildings, surrounding neighborhoods, and wooded hills beyond the skyline.",
  heroImageLabel: "White Plains from above",
  heroImageSummary: "Downtown at the center, with White Plains neighborhoods rising behind it.",
  aboutImage: "/assets/img/photos/white-plains-main.jpeg",
  aboutImageAlt: "Aerial view of downtown White Plains with nearby neighborhoods and hills in the background.",
  mission:
    "We're a group of neighborhood associations working together to help people stay informed and connected across White Plains.",
  meetingNote:
    "WPCNA usually meets on the second Tuesday of the month at 7:00 p.m. We share agenda details when they're ready.",
  communityChannels: [
    {
      label: "White Plains BID on Instagram",
      url: "https://www.instagram.com/whiteplains.bid/"
    },
    {
      label: "Library event calendar",
      url: "https://calendar.whiteplainslibrary.org/"
    },
    {
      label: "City calendar",
      url: "https://www.cityofwhiteplains.com/Calendar.aspx"
    }
  ]
};
