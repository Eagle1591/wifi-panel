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
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText || ""}`)
      }
      
      const data = await res.json()
      setRawResponse(data)

      if (data && data.success && Array.isArray(data.videos)) {
        setResults(data.videos)
        if (data.videos.length === 0) {
          setError("No videos found for that query.")
        }
      } else {
        throw new Error(data?.message || "Unexpected API response format")
      }
    } catch (err) {
      console.error("Search error:", err)
      setError(err.message || "Failed to search videos. Please try again.")
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

  function clearSearch() {
    setQuery("")
    setResults(null)
    setError("")
    setSearched(false)
    setRawResponse(null)
    inputRef.current?.focus()
  }

  return (
    <>
      <AnimatedBackground />
      <Layout>
        <main className={`page-wrapper ${searched ? "scrolled" : ""}`}>
          <form className="search-block" onSubmit={handleSearch} role="search">
            <div className="search-inner">
              <div className="header-content">
                <h1 className="title">YouTube Search</h1>
                <p className="subtitle">Search and discover YouTube videos</p>
              </div>

              <div className="search-row">
                <div className="input-container">
                  <input
                    ref={inputRef}
                    type="search"
                    aria-label="Search YouTube"
                    placeholder="Enter song, artist, or video name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                    disabled={loading}
                  />
                  {query && (
                    <button 
                      type="button" 
                      className="clear-btn"
                      onClick={clearSearch}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="search-btn" 
                  disabled={loading || !query.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>

              <div className="hint">
                Press Enter to search • Powered by Casper Tech API
              </div>
            </div>
          </form>

          <section className="content-area" aria-live="polite">
            {loading && (
              <div className="status loading">
                <div className="spinner"></div>
                <span>Searching YouTube for "{query}"...</span>
              </div>
            )}

            {error && !loading && (
              <div className="status error">
                <div className="error-content">
                  <strong>Search Failed</strong>
                  <p>{error}</p>
                  <button className="retry-btn" onClick={handleRetry}>
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {results && results.length > 0 && (
              <>
                <div className="results-header">
                  <h2 className="results-title">
                    Found {results.length} video{results.length !== 1 ? 's' : ''} for "{query}"
                  </h2>
                  <button className="new-search-btn" onClick={clearSearch}>
                    New Search
                  </button>
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
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI4MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGM0YzIi8+CjxwYXRoIGQ9Ik0xMDQgODBMMTE2IDg4TDEwNCA5NlY4MFoiIGZpbGw9IiM5OTk5OTkiLz4KPHN2Zz4K'
                          }}
                        />
                        <div className="duration-badge">{video.duration}</div>
                      </div>
                      
                      <div className="card-content">
                        <h3 className="video-title" title={video.title}>
                          {video.title}
                        </h3>
                        
                        <div className="channel-info">
                          <span className="channel-icon">📺</span>
                          <span className="channel-name">{video.channel}</span>
                        </div>
                        
                        <div className="meta-info">
                          <span className="views">{video.views}</span>
                          <span className="separator">•</span>
                          <span className="duration">{video.duration}</span>
                        </div>

                        <div className="actions">
                          <a 
                            className="watch-btn" 
                            href={video.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Watch on YouTube"
                          >
                            <span className="btn-icon">▶</span>
                            Watch on YouTube
                          </a>
                          
                          <div className="coming-soon">
                            Download options coming soon...
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {results && results.length === 0 && !loading && !error && (
              <div className="status info">
                <div className="info-content">
                  <strong>No videos found</strong>
                  <p>No results found for "{query}". Try different keywords.</p>
                  <button className="retry-btn" onClick={clearSearch}>
                    New Search
                  </button>
                </div>
              </div>
            )}

            {!loading && rawResponse && (
              <details className="raw">
                <summary>Debug: Show API Response</summary>
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
            padding: 1.5rem;
            border-radius: 12px;
            text-align: left;
            display: block;
            z-index: 100;
          }

          .header-content {
            margin-bottom: 1.5rem;
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

          .page-wrapper.scrolled .header-content {
            margin-bottom: 1rem;
          }

          .page-wrapper.scrolled .title {
            font-size: 1.3rem;
            margin-bottom: 0.25rem;
          }

          .page-wrapper.scrolled .subtitle {
            font-size: 0.9rem;
            margin: 0;
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

          .input-container {
            position: relative;
            flex: 1 1 520px;
            min-width: 160px;
          }

          .search-input {
            width: 100%;
            padding: 0.9rem 1rem;
            font-size: 1rem;
            border-radius: 999px;
            border: none;
            outline: none;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.08);
            color: #fff;
            transition: all 0.2s ease;
            padding-right: 2.5rem;
          }

          .search-input:focus {
            box-shadow: inset 0 0 0 2px rgba(0, 102, 255, 0.6);
            background: rgba(255,255,255,0.12);
          }

          .search-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .search-input::placeholder {
            color: rgba(255,255,255,0.6);
          }

          .clear-btn {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            line-height: 1;
            transition: all 0.2s ease;
          }

          .clear-btn:hover {
            background: rgba(255,255,255,0.3);
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
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            background: #666;
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
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(255,255,255,0.1);
          }

          .status.loading {
            background: rgba(0, 102, 255, 0.15);
            border-color: rgba(0, 102, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
          }

          .status.error {
            background: rgba(220, 53, 69, 0.15);
            border-color: rgba(220, 53, 69, 0.3);
          }

          .status.info {
            background: rgba(255, 193, 7, 0.15);
            border-color: rgba(255, 193, 7, 0.3);
          }

          .error-content,
          .info-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }

          .retry-btn,
          .new-search-btn {
            padding: 0.6rem 1.2rem;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .retry-btn:hover,
          .new-search-btn:hover {
            background: #fff;
            transform: translateY(-1px);
          }

          .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding: 0 0.5rem;
          }

          .results-title {
            color: #fff;
            font-size: 1.3rem;
            margin: 0;
            font-weight: 600;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
            height: 170px;
            overflow: hidden;
            background: #f0f0f0;
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
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            flex: 1;
          }

          .video-title {
            font-size: 1.05rem;
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

          .channel-icon {
            font-size: 0.9rem;
          }

          .channel-name {
            color: #555;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .meta-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #666;
            font-size: 0.85rem;
          }

          .separator {
            opacity: 0.6;
          }

          .actions {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .watch-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background: #ff0000;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.2s ease;
          }

          .watch-btn:hover {
            background: #cc0000;
            transform: translateY(-1px);
          }

          .btn-icon {
            font-size: 0.8rem;
          }

          .coming-soon {
            text-align: center;
            color: #666;
            font-size: 0.8rem;
            font-style: italic;
            padding: 0.5rem;
            background: #f8f9fa;
            border-radius: 6px;
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
            transition: background 0.2s ease;
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
            border: 1px solid #e9ecef;
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

            .input-container {
              flex: none;
              width: 100%;
            }

            .search-btn {
              width: 100%;
            }

            .results-header {
              flex-direction: column;
              gap: 1rem;
              align-items: flex-start;
            }

            .grid {
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 1rem;
            }

            .thumb-container {
              height: 160px;
            }
          }

          @media (max-width: 480px) {
            .grid {
              grid-template-columns: 1fr;
            }
            
            .card-content {
              padding: 1rem;
            }
          }
        `}</style>
      </Layout>
    </>
  )
}
