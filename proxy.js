export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const target = req.query.url;
  if (!target) return res.status(400).json({ error: "url parametresi eksik" });

  const ALLOWED = ["www.rugpullbakery.com", "backend.portal.abs.xyz"];
  let hostname;
  try {
    hostname = new URL(target).hostname;
  } catch {
    return res.status(400).json({ error: "Geçersiz URL" });
  }

  if (!ALLOWED.includes(hostname)) {
    return res.status(403).json({ error: "Bu domain'e izin verilmiyor" });
  }

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
}
