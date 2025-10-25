// pages/api/youtube.js
export default async function handler(req, res) {
  const { query } = req.query
  if (!query) return res.status(400).json({ success: false, message: "Missing query" })

  try {
    const apiUrl = `https://casper-tech-apis.vercel.app/api/play/youtube2?query=${encodeURIComponent(query)}`
    const apiRes = await fetch(apiUrl, { method: "GET" })
    const text = await apiRes.text()

    // Forward status and parsed JSON if possible
    try {
      const data = JSON.parse(text)
      return res.status(apiRes.status).json(data)
    } catch (err) {
      // If not valid JSON, forward raw text
      return res.status(apiRes.status).json({ success: false, raw: text })
    }
  } catch (err) {
    console.error("server fetch error:", err)
    return res.status(502).json({ success: false, message: "Server fetch error" })
  }
}
