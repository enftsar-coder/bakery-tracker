const https = require("https");
const { URL } = require("url");
const ALLOWED = ["www.rugpullbakery.com", "backend.portal.abs.xyz"];
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  const targetUrl = req.query.url;
  if (!targetUrl) { res.status(400).json({ error: "url param missing" }); return; }
  let parsed;
  try { parsed = new URL(targetUrl); } catch(e) { res.status(400).json({ error: "invalid url" }); return; }
  if (!ALLOWED.includes(parsed.hostname)) { res.status(403).json({ error: "domain not allowed" }); return; }
  return new Promise((resolve) => {
    const r = https.request(
      { hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: "GET",
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" } },
      (upstream) => {
        let body = "";
        upstream.setEncoding("utf8");
        upstream.on("data", c => body += c);
        upstream.on("end", () => {
          res.setHeader("Content-Type", "application/json");
          res.status(upstream.statusCode).send(body);
          resolve();
        });
      }
    );
    r.on("error", e => { res.status(502).json({ error: e.message }); resolve(); });
    r.setTimeout(10000, () => { r.destroy(); res.status(504).json({ error: "timeout" }); resolve(); });
    r.end();
  });
};
