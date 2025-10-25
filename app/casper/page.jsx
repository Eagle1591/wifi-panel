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
      const apiUrl = `https://casper-tech-apis.vercel.app/api/search/youtube?query=${encodeURIComponent(q)}`
      console.log("Fetching from:", apiUrl)
      
      const res = await fetch(apiUrl)
      const text = await res.text()
      let data = null
      
      try {
        data = JSON.parse(text)
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr)
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
        // Enhance videos with download links using the videoId
        const enhancedVideos = data.videos.map(video => ({
          ...video,
          downloads: {
            mp3: `https://casper-tech-apis.vercel.app/api/download/youtube/mp3?videoId=${video.videoId}`,
            mp4: `https://casper-tech-apis.vercel.app/api/download/youtube/mp4?videoId=${video.videoId}`
          }
        }))
        
        setResults(enhancedVideos)
        if (data.videos.length === 0) setError("No videos found for that query.")
      } else {
        setResults([])
        setError(data?.message || "Unexpected API response format.")
      }
    } catch (err) {
      console.error("Search error:", err)
      setError("Network error - unable to reach the search API.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch(e)
  }

  function handleRetry() {
    if (query.trim()) {
      handleSearch()
    } else {
      inputRef.current?.focus()
    }
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
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="search-btn" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Searching…
                    </>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>

              <div className="hint">
                Press Enter or click Search. Powered by Casper Tech API.
              </div>
            </div>
          </form>

          <section className="content-area" aria-live="polite">
            {loading && (
              <div className="status loading">
                <div className="spinner"></div>
                🔍 Searching YouTube for "{query}"…
              </div>
            )}

            {error && !loading && (
              <div className="status error">
                <strong>Error:</strong> {error}
                <button className="retry-btn" onClick={handleRetry}>
                  Try Again
                </button>
              </div>
            )}

            {results && results.length > 0 && (
              <>
                <div className="results-info">
                  Found {results.length} video{results.length !== 1 ? 's' : ''} for "{query}"
                </div>
                <div className="grid">
                  {results.map((video, index) => (
                    <article className="card" key={video.videoId ?? index}>
                      <div className="thumb-container">
                        <img 
                          className="thumb" 
                          src={video.thumbnail} 
                          alt={`Thumbnail for ${video.title}`}
                          loading="lazy"
                        />
                        <div className="duration-badge">{video.duration}</div>
                      </div>
                      
                      <div className="card-content">
                        <h3 className="video-title" title={video.title}>
                          {video.title}
                        </h3>
                        
                        <div className="channel-info">
                          <span className="channel-name">{video.channel}</span>
                        </div>
                        
                        <div className="meta">
                          <span className="views">{video.views}</span>
                        </div>

                        <div className="actions">
                          <a 
                            className="btn mp3-btn" 
                            href={video.downloads.mp3}
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Download MP3"
                          >
                            🎵 MP3
                          </a>
                          
                          <a 
                            className="btn mp4-btn" 
                            href={video.downloads.mp4}
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Download MP4"
                          >
                            🎥 MP4
                          </a>

                          <a 
                            className="link watch-link" 
                            href={video.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Watch on YouTube"
                          >
                            ▶ Watch
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {results && results.length === 0 && !loading && !error && (
              <div className="status info">
                No videos found for "{query}". Try different keywords.
              </div>
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
            z-index: 100;
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
            transition: all 0.2s ease;
          }

          .search-input:focus {
            box-shadow: inset 0 0 0 2px rgba(0, 102, 255, 0.6);
            background: rgba(255,255,255,0.08);
          }

          .search-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .search-input::placeholder {
            color: rgba(255,255,255,0.65);
          }

          .search-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 999px;
            border: none;
            background: linear-gradient(90deg, #0066ff, #00a3ff);
            color: white;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(3, 102, 255, 0.24);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 120px;
            justify-content: center;
          }

          .search-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(3, 102, 255, 0.35);
          }

          .search-btn:active:not(:disabled) {
            transform: translateY(1px);
          }

          .search-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
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
            padding: 1rem 1.5rem;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            flex-wrap: wrap;
          }

          .status.loading {
            background: rgba(0, 102, 255, 0.2);
            border: 1px solid rgba(0, 102, 255, 0.3);
          }

          .status.error {
            background: rgba(220, 53, 69, 0.2);
            border: 1px solid rgba(220, 53, 69, 0.3);
            flex-direction: column;
            gap: 1rem;
          }

          .status.info {
            background: rgba(255, 193, 7, 0.2);
            border: 1px solid rgba(255, 193, 7, 0.3);
          }

          .retry-btn {
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.9);
            color: #dc3545;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .retry-btn:hover {
            background: #fff;
            transform: translateY(-1px);
          }

          .results-info {
            color: #fff;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 0.75rem;
            border-radius: 8px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
          }

          .card {
            background: rgba(255, 255, 255, 0.98);
            color: #111;
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 8px 30px rgba(6, 24, 64, 0.12);
            transition: all 0.3s ease;
          }

          .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(6, 24, 64, 0.18);
          }

          .thumb-container {
            position: relative;
            width: 100%;
            height: 160px;
            overflow: hidden;
          }

          .thumb {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .card:hover .thumb {
            transform: scale(1.05);
          }

          .duration-badge {
            position: absolute;
            bottom: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
          }

          .card-content {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            flex: 1;
          }

          .video-title {
            font-size: 1rem;
            margin: 0;
            line-height: 1.3;
            font-weight: 600;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .channel-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .channel-name {
            color: #555;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .meta {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-wrap: wrap;
          }

          .views {
            color: #666;
            font-size: 0.85rem;
          }

          .actions {
            margin-top: auto;
            display: flex;
            gap: 0.5rem;
            align-items: center;
            flex-wrap: wrap;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            padding: 0.5rem 0.75rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.2s ease;
            flex: 1;
            min-width: 60px;
          }

          .mp3-btn {
            background: #28a745;
            color: #fff;
          }

          .mp3-btn:hover {
            background: #218838;
            transform: translateY(-1px);
          }

          .mp4-btn {
            background: #dc3545;
            color: #fff;
          }

          .mp4-btn:hover {
            background: #c82333;
            transform: translateY(-1px);
          }

          .watch-link {
            margin-left: auto;
            color: #0b74ff;
            text-decoration: none;
            font-weight: 600;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.2s ease;
          }

          .watch-link:hover {
            background: rgba(11, 116, 255, 0.1);
            transform: translateY(-1px);
          }

          .raw {
            margin-top: 2rem;
            background: rgba(255,255,255,0.95);
            padding: 1rem;
            border-radius: 12px;
            color: #111;
          }

          summary {
            cursor: pointer;
            font-weight: 600;
            padding: 0.5rem;
            border-radius: 6px;
            background: #f8f9fa;
          }

          summary:hover {
            background: #e9ecef;
          }

          pre {
            max-height: 400px;
            overflow: auto;
            white-space: pre-wrap;
            word-break: break-word;
            margin: 0;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            font-size: 0.85rem;
          }

          @media (max-width: 768px) {
            .page-wrapper {
              padding: 2rem 1rem;
            }

            .search-inner {
              padding: 1.5rem;
            }

            .search-row {
              flex-direction: column;
            }

            .search-input {
              flex: none;
              width: 100%;
            }

            .search-btn {
              width: 100%;
            }

            .grid {
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 1rem;
            }

            .thumb-container {
              height: 140px;
            }
          }

          @media (max-width: 480px) {
            .grid {
              grid-template-columns: 1fr;
            }
            
            .actions {
              flex-direction: column;
            }
            
            .watch-link {
              margin-left: 0;
              text-align: center;
            }
          }
        `}</style>
      </Layout>
    </>
  )
}
