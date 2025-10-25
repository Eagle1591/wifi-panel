// pages/downloader.js
"use client"

import Layout from "../../components/Layout"
import AnimatedBackground from "../../components/AnimatedBackground"
import { useState, useRef } from "react"

export default function Downloader() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)
  const [rawResponse, setRawResponse] = useState(null)
  const inputRef = useRef(null)

  async function handleSearch(e) {
    if (e) e.preventDefault()
    const q = query.trim()
    if (!q) {
      setError("Please enter search keywords.")
      return
    }

    setError("")
    setLoading(true)
    setSearched(true)
    setResults(null)
    setRawResponse(null)

    try {
      const res = await fetch(`/api/youtube?query=${encodeURIComponent(q)}`)
      const text = await res.text()
      let data = null
      try {
        data = JSON.parse(text)
      } catch (parseErr) {
        setError("API returned invalid JSON.")
        setRawResponse(text)
        setLoading(false)
        return
      }

      setRawResponse(data)

      if (!res.ok) {
        setError(`API error: ${res.status} ${res.statusText || ""}`)
        setResults([])
        setLoading(false)
        return
      }

      if (data && data.success && Array.isArray(data.videos)) {
        setResults(data.videos)
        if (data.videos.length === 0) setError("No videos returned by the API for that query.")
      } else {
        setResults([])
        setError("Unexpected API response shape or no results.")
      }
    } catch (err) {
      console.error(err)
      setError("Network error.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch(e)
  }

  return (
    <>
      <AnimatedBackground />
      <Layout>
        <main className={`page-wrapper ${searched ? "scrolled" : ""}`}>
          <form className="search-block" onSubmit={handleSearch} role="search">
            <div className="search-inner">
              <h1 className="title">YouTube Downloader</h1>
              <p className="subtitle">Search YouTube and download MP3 / MP4</p>

              <div className="search-row">
                <input
                  ref={inputRef}
                  type="search"
                  aria-label="Search YouTube"
                  placeholder="Search YouTube (e.g. shape of you)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="search-input"
                />
                <button type="submit" className="search-btn" disabled={loading}>
                  {loading ? "Searching…" : "Search"}
                </button>
              </div>

              <div className="hint">
                Press Enter or click Search. The search box will move to the top after searching.
              </div>
            </div>
          </form>

          <section className="content-area" aria-live="polite">
            {loading && <div className="status">🔄 Fetching results…</div>}

            {error && !loading && (
              <div className="status error">
                <strong>Error:</strong> {error}
              </div>
            )}

            {results && results.length > 0 && (
              <div className="grid">
                {results.map((v, i) => (
                  <article className="card" key={v.videoId ?? i}>
                    <img className="thumb" src={v.thumbnail} alt={v.title} />
                    <h3 className="video-title">{v.title}</h3>
                    <div className="meta">
                      <span>{v.channel}</span>
                      <span>•</span>
                      <span>{v.duration}</span>
                      <span>•</span>
                      <span>{v.views}</span>
                    </div>

                    <div className="actions">
                      {v.downloads?.mp3 ? (
                        <a className="btn" href={v.downloads.mp3} target="_blank" rel="noopener noreferrer">🎵 MP3</a>
                      ) : (
                        <span className="no">MP3 N/A</span>
                      )}

                      {v.downloads?.mp4 ? (
                        <a className="btn" href={v.downloads.mp4} target="_blank" rel="noopener noreferrer">🎥 MP4</a>
                      ) : (
                        <span className="no">MP4 N/A</span>
                      )}

                      <a className="link" href={v.url} target="_blank" rel="noopener noreferrer">▶ Watch</a>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {results && results.length === 0 && !loading && (
              <div className="status">No downloadable videos found for that query.</div>
            )}

            {!loading && rawResponse && (
              <details className="raw">
                <summary>Show raw API response (debug)</summary>
                <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
              </details>
            )}
          </section>
        </main>

        <style jsx>{`
          .page-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 1.5rem;
            box-sizing: border-box;
          }

          .page-wrapper.scrolled {
            align-items: stretch;
            justify-content: flex-start;
            padding-top: 3rem;
            padding-bottom: 6rem;
          }

          .search-block {
            width: 100%;
            max-width: 900px;
            margin: 0 auto 2rem auto;
            display: flex;
            justify-content: center;
            pointer-events: auto;
          }

          .search-inner {
            width: 100%;
            background: rgba(0, 0, 0, 0.35);
            padding: 2.2rem;
            border-radius: 14px;
            text-align: center;
            color: #fff;
            backdrop-filter: blur(6px);
            box-shadow: 0 6px 30px rgba(0, 0, 0, 0.45);
            transition: all 300ms ease;
          }

          .page-wrapper.scrolled .search-inner {
            position: sticky;
            top: 18px;
            margin: 0 auto;
            padding: 1rem;
            border-radius: 10px;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .title {
            margin: 0 0 0.25rem 0;
            font-size: 1.6rem;
            font-weight: 700;
            color: #fff;
          }

          .subtitle {
            margin: 0 0 1rem 0;
            color: #e6e6e6;
            font-size: 0.95rem;
          }

          .page-wrapper.scrolled .title,
          .page-wrapper.scrolled .subtitle {
            display: none;
          }

          .search-row {
            display: flex;
            gap: 0.75rem;
            align-items: center;
            justify-content: center;
          }

          .page-wrapper.scrolled .search-row {
            justify-content: flex-start;
            width: 100%;
          }

          .search-input {
            flex: 1 1 520px;
            min-width: 160px;
            padding: 0.9rem 1rem;
            font-size: 1rem;
            border-radius: 999px;
            border: none;
            outline: none;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
            background: rgba(255,255,255,0.06);
            color: #fff;
          }

          .search-input::placeholder {
            color: rgba(255,255,255,0.65);
          }

          .search-btn {
            padding: 0.75rem 1rem;
            border-radius: 999px;
            border: none;
            background: linear-gradient(90deg, #0066ff, #00a3ff);
            color: white;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(3, 102, 255, 0.24);
            transition: transform 120ms ease;
          }

          .search-btn:active {
            transform: translateY(1px);
          }

          .hint {
            margin-top: 0.9rem;
            font-size: 0.86rem;
            color: rgba(255,255,255,0.75);
          }

          .content-area {
            width: 100%;
            max-width: 1200px;
            margin: 1.5rem auto 4rem auto;
          }

          .status {
            color: #fff;
            background: rgba(0,0,0,0.4);
            padding: 0.8rem 1rem;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 1rem;
          }
          .status.error {
            background: rgba(150, 40, 40, 0.85);
            color: #fff;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 1.15rem;
          }

          .card {
            background: rgba(255, 255, 255, 0.98);
            color: #111;
            border-radius: 12px;
            padding: 0.9rem;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            box-shadow: 0 8px 30px rgba(6, 24, 64, 0.12);
            overflow: hidden;
          }

          .thumb {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            background: #ddd;
          }

          .video-title {
            font-size: 1rem;
            margin: 0;
            line-height: 1.2;
          }

          .meta {
            color: #555;
            font-size: 0.85rem;
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            align-items: center;
          }

          .actions {
            margin-top: auto;
            display: flex;
            gap: 0.5rem;
            align-items: center;
            flex-wrap: wrap;
          }

          .btn {
            display: inline-block;
            text-decoration: none;
            padding: 0.45rem 0.7rem;
            border-radius: 8px;
            background: #0b74ff;
            color: #fff;
            font-weight: 600;
            font-size: 0.9rem;
          }

          .no {
            color: #888;
            font-size: 0.9rem;
            padding: 0.45rem 0.7rem;
            border-radius: 8px;
            background: #f3f3f3;
          }

          .link {
            margin-left: auto;
            color: #0b74ff;
            text-decoration: none;
            font-weight: 600;
          }

          .raw {
            margin-top: 1rem;
            background: rgba(255,255,255,0.95);
            padding: 0.75rem;
            border-radius: 8px;
            color: #111;
          }

          pre {
            max-height: 300px;
            overflow: auto;
            white-space: pre-wrap;
            word-break: break-word;
            margin: 0;
          }

          @media (max-width: 640px) {
            .search-input { flex-basis: 1; }
            .thumb { height: 130px; }
          }
        `}</style>
      </Layout>
    </>
  )
}
