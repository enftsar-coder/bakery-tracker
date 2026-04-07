const https = require("https");
const { URL } = require("url");

const ALLOWED = ["www.rugpullbakery.com", "backend.portal.abs.xyz"];

function setNoStore(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");
}

function setCacheHeaders(res, parsed) {
  const path = parsed.pathname || "";
  let sMaxAge = 60;
  let staleWhileRevalidate = 300;

  if (parsed.hostname === "backend.portal.abs.xyz") {
    if (path.includes("/search/users")) {
      sMaxAge = 60;
      staleWhileRevalidate = 300;
    } else if (path.includes("/user/address/")) {
      sMaxAge = 300;
      staleWhileRevalidate = 1800;
    } else {
      sMaxAge = 120;
      staleWhileRevalidate = 600;
    }
  } else if (parsed.hostname === "www.rugpullbakery.com") {
    if (path.includes("/api/trpc/leaderboard.getActiveSeason")) {
      sMaxAge = 300;
      staleWhileRevalidate = 1800;
    } else if (path.includes("/api/trpc/leaderboard.getTopBakeries")) {
      sMaxAge = 300;
      staleWhileRevalidate = 1800;
    } else if (path.includes("/api/trpc/profiles.getByAddress")) {
      sMaxAge = 300;
      staleWhileRevalidate = 1800;
    }
  }

  const value = `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
  res.setHeader("Cache-Control", value);
  res.setHeader("CDN-Cache-Control", value);
  res.setHeader("Vercel-CDN-Cache-Control", value);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    setNoStore(res);
    res.status(200).end();
    return;
  }

  const targetUrl = req.query.url;
  if (!targetUrl) {
    setNoStore(res);
    res.status(400).json({ error: "url param missing" });
    return;
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch (e) {
    setNoStore(res);
    res.status(400).json({ error: "invalid url" });
    return;
  }

  if (!ALLOWED.includes(parsed.hostname)) {
    setNoStore(res);
    res.status(403).json({ error: "domain not allowed" });
    return;
  }

  return new Promise((resolve) => {
    const request = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      },
      (upstream) => {
        let body = "";
        upstream.setEncoding("utf8");
        upstream.on("data", (chunk) => {
          body += chunk;
        });
        upstream.on("end", () => {
          if (upstream.statusCode >= 200 && upstream.statusCode < 400) setCacheHeaders(res, parsed);
          else setNoStore(res);
          res.setHeader("Content-Type", upstream.headers["content-type"] || "application/json; charset=utf-8");
          res.status(upstream.statusCode).send(body);
          resolve();
        });
      }
    );

    request.on("error", (error) => {
      setNoStore(res);
      res.status(502).json({ error: error.message });
      resolve();
    });

    request.setTimeout(10000, () => {
      request.destroy();
      setNoStore(res);
      res.status(504).json({ error: "timeout" });
      resolve();
    });

    request.end();
  });
};
