// Cloudflare Worker — handles WPCNA community posting form submissions.
// Sends email via Resend API. All recipient addresses live in secrets.

const RATE_LIMIT_WINDOW = 600; // 10 minutes
const RATE_LIMIT_MAX = 5;      // max submissions per IP per window
const MAX_MESSAGE_LENGTH = 240;

// Simple in-memory rate limiter (resets on worker eviction, which is fine
// for a small civic site — the goal is basic abuse prevention, not ironclad).
const ipCounts = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW * 1000) {
    ipCounts.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function corsHeaders(origin, allowed) {
  if (origin !== allowed && allowed !== "*") return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return jsonError("Method not allowed", 405);
    }

    // Rate limit by connecting IP
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(ip)) {
      const res = jsonError("Too many submissions. Please try again later.", 429);
      Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid request body", 400);
    }

    // Honeypot — if this field has a value, it was filled by a bot
    if (body.website) {
      // Return fake success so bots think it worked
      const res = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...cors },
      });
      return res;
    }

    // Validate fields
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    const errors = [];
    if (!name || name.length > 200) errors.push("Name is required (max 200 characters).");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email address is required.");
    if (!subject || subject.length > 200) errors.push("Subject is required (max 200 characters).");
    if (!message) errors.push("Message is required.");
    if (message.length > MAX_MESSAGE_LENGTH) errors.push(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);

    if (errors.length) {
      const res = jsonError(errors.join(" "), 422);
      Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    // Build email via Resend
    const toAddress = env.RECIPIENT_TO;
    const ccAddress = env.RECIPIENT_CC;

    const emailPayload = {
      from: "WPCNA Site <noreply@wpcna.org>",
      to: [toAddress],
      cc: ccAddress ? [ccAddress] : [],
      reply_to: email,
      subject: `[Community Posting] ${subject}`,
      text: [
        `Community posting submission from the WPCNA website.`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
    };

    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      if (!resendRes.ok) {
        const detail = await resendRes.text();
        console.error("Resend error:", resendRes.status, detail);
        const res = jsonError("Something went wrong sending your submission. Please try again.", 502);
        Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
        return res;
      }

      const res = new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...cors },
      });
      return res;
    } catch (err) {
      console.error("Fetch error:", err);
      const res = jsonError("Something went wrong. Please try again.", 502);
      Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }
  },
};
