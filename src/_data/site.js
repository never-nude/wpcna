const runtimePathPrefix = process.env.SITE_PATH_PREFIX || "/";
const canonicalPathPrefix = process.env.CANONICAL_PATH_PREFIX || process.env.SITE_PATH_PREFIX || "/wpcna";
const deployBaseUrl = process.env.SITE_BASE_URL || "https://never-nude.github.io";
const cleanCanonicalPrefix = canonicalPathPrefix === "/" ? "" : canonicalPathPrefix.replace(/\/$/, "");

module.exports = {
  name: "White Plains Council of Neighborhood Associations",
  shortName: "WPCNA",
  tagline: "White Plains civic and neighborhood guide.",
  baseUrl: `${deployBaseUrl.replace(/\/$/, "")}${cleanCanonicalPrefix}`,
  pathPrefix: runtimePathPrefix,
  themeColor: "#0062B8",
  contactName: "Michael Dalton, President",
  email: "info@wpcna.org",
  emailMailto: "info@wpcna.org?bcc=michael%40mdalton.com",
  location: "White Plains, New York",
  defaultOgImage: "/assets/img/photos/white-plains-main.jpeg",
  heroImage: "/assets/img/photos/white-plains-main.jpeg",
  heroImageAlt: "Aerial view of downtown White Plains with high-rise buildings, surrounding neighborhoods, and wooded hills beyond the skyline.",
  aboutImage: "/assets/img/photos/white-plains-main.jpeg",
  aboutImageAlt: "Aerial view of downtown White Plains with nearby neighborhoods and hills in the background.",
  mission:
    "WPCNA helps keep neighborhood concerns, local events, and civic information easier to follow across White Plains.",
  purpose:
    "White Plains has City Hall meetings, downtown events, library programs, neighborhood association materials, and public notices all moving at once. This site pulls the most useful pieces together with a neighborhood lens.",
  useItFor:
    "Use it to see what is coming up, get a clearer feel for different parts of the city, and find the White Plains pages residents end up needing again and again.",
  meetingNote:
    "WPCNA usually meets on the second Tuesday of the month at 7:00 p.m. Meetings are held in person at the White Plains Board of Education building (5 Homeside Lane) or online via Zoom, depending on the agenda. Format and timing can shift month to month, so check the latest agenda before you go.",
  communityChannels: [
    {
      label: "White Plains Public Library calendar",
      url: "https://calendar.whiteplainslibrary.org/"
    },
    {
      label: "City of White Plains calendar",
      url: "https://www.cityofwhiteplains.com/Calendar.aspx"
    }
  ],
  footerNote: "Neighborhood-centered civic guide for White Plains."
};
