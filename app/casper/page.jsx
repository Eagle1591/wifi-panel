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
  const [downloadingVideo, setDownloadingVideo] = useState(null)
  const [downloadFormats, setDownloadFormats] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
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
      const data = await fetchSearchResults(q)
      
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
      setError(err.message || "Search failed. Please try again later.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  async function fetchSearchResults(query) {
    try {
      console.log("Fetching search results via proxy...");
      
      // Use the Next.js API proxy
      const proxyUrl = `../app/api/youtube-search?query=${encodeURIComponent(query)}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Proxy responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search via proxy successful");
      return data;
      
    } catch (error) {
      console.log("Proxy search request failed:", error);
      throw new Error("Unable to connect to search service. Please try again.");
    }
  }

  async function fetchDownloadFormats(videoUrl, videoId) {
    setDownloadingVideo(videoId)
    setDownloadFormats(null)
    setSelectedVideo(null)

    try {
      // For download, we can try both direct and proxy approaches
      const apiUrl = `https://casper-tech-apis.vercel.app/api/downloader/yt-dl?url=${encodeURIComponent(videoUrl)}`
      
      let response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      // If direct download fails, try via proxy
      if (!response.ok) {
        console.log("Direct download failed, trying proxy...");
        const proxyUrl = `/api/youtube-download?url=${encodeURIComponent(videoUrl)}`;
        response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
      }

      if (!response.ok) {
        throw new Error('Failed to fetch download formats')
      }

      const data = await response.json()
      
      if (data.success && data.medias) {
        setDownloadFormats(data)
        setSelectedVideo(videoId)
      } else {
        throw new Error('No download formats available')
      }
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to load download options. Please try again.')
    } finally {
      setDownloadingVideo(null)
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
    setDownloadFormats(null)
    setSelectedVideo(null)
    inputRef.current?.focus()
  }

  const useMockData = () => {
    const mockVideos = [
      {
        title: "Alan Walker - Faded",
        videoId: "60ItHLz5WEA",
        url: "https://www.youtube.com/watch?v=60ItHLz5WEA",
        thumbnail: "https://i.ytimg.com/vi/60ItHLz5WEA/hq720.jpg",
        channel: "Alan Walker",
        duration: "3:33",
        views: "3,879,495,729 views"
      },
      {
        title: "Alan Walker - Faded (Lyrics)",
        videoId: "qdpXxGPqW-Y",
        url: "https://www.youtube.com/watch?v=qdpXxGPqW-Y",
        thumbnail: "https://i.ytimg.com/vi/qdpXxGPqW-Y/hq720.jpg",
        channel: "7clouds",
        duration: "3:33",
        views: "285,803,941 views"
      }
    ]
    
    setQuery("faded")
    setSearched(true)
    setResults(mockVideos)
    setRawResponse({ success: true, videos: mockVideos, mock: true })
    setError("")
    setLoading(false)
  }

  function formatFileSize(bytes) {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(2) + ' MB'
  }

  function getQualityBadgeColor(quality) {
    if (quality.includes('1080p')) return '#e74c3c'
    if (quality.includes('720p')) return '#e67e22'
    if (quality.includes('480p')) return '#f39c12'
    if (quality.includes('360p')) return '#3498db'
    return '#95a5a6'
  }

  return (
    <>
      <AnimatedBackground />
      <Layout>
        <main className={`page-wrapper ${searched ? "scrolled" : ""}`}>
          <form className="search-block" onSubmit={handleSearch} role="search">
            <div className="search-inner">
              <div className="header-content">
                <h1 className="title">🎵 YouTube Downloader</h1>
                <p className="subtitle">Search, discover, and download YouTube videos</p>
                <div className="api-actions">
                  <button 
                    type="button" 
                    className="mock-btn"
                    onClick={useMockData}
                    title="Use sample data for testing"
                  >
                    📊 Sample Data
                  </button>
                </div>
              </div>

              <div className="search-row">
                <div className="input-container">
                  <span className="search-icon">🔍</span>
                  <input
                    ref={inputRef}
                    type="search"
                    aria-label="Search YouTube"
                    placeholder="Search for songs, artists, or videos..."
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
                    <>
                      <span>🚀</span>
                      Search
                    </>
                  )}
                </button>
              </div>

              <div className="hint">
                💡 Press Enter to search • Using API proxy • Fast downloads
              </div>
            </div>
          </form>

          <section className="content-area" aria-live="polite">
            {loading && (
              <div className="status loading">
                <div className="spinner large"></div>
                <span>Searching YouTube for "{query}"...</span>
                <div className="loading-details">Using secure API proxy...</div>
              </div>
            )}

            {error && !loading && (
              <div className="status error">
                <div className="error-content">
                  <div className="error-icon">⚠️</div>
                  <div className="error-text">
                    <strong>Search Failed</strong>
                    <p>{error}</p>
                    <p className="error-help">
                      This might be due to network restrictions or the API service being temporarily unavailable.
                      Try using the sample data button above to see how the interface works.
                    </p>
                  </div>
                  <div className="error-actions">
                    <button className="retry-btn" onClick={handleRetry}>
                      🔄 Try Again
                    </button>
                    <button className="secondary-btn" onClick={clearSearch}>
                      ✨ New Search
                    </button>
                    <button className="secondary-btn" onClick={useMockData}>
                      📊 Use Sample
                    </button>
                  </div>
                </div>
              </div>
            )}

            {results && results.length > 0 && (
              <>
                <div className="results-header">
                  <h2 className="results-title">
                    <span className="result-icon">🎯</span>
                    Found {results.length} video{results.length !== 1 ? 's' : ''} for "{query}"
                    {rawResponse?.mock && <span className="mock-badge">📊 Sample</span>}
                  </h2>
                  <button className="new-search-btn" onClick={clearSearch}>
                    ✨ New Search
                  </button>
                </div>
                
                <div className="grid">
                  {results.map((video, index) => (
                    <article className="card" key={video.videoId ?? `video-${index}`}>
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
                        <div className="duration-badge">⏱️ {video.duration}</div>
                        <div className="play-overlay">
                          <div className="play-icon">▶</div>
                        </div>
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
                          <span className="views">👁️ {video.views}</span>
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
                          
                          <button
                            className="download-btn"
                            onClick={() => fetchDownloadFormats(video.url, video.videoId)}
                            disabled={downloadingVideo === video.videoId}
                          >
                            {downloadingVideo === video.videoId ? (
                              <>
                                <span className="spinner small"></span>
                                Loading...
                              </>
                            ) : (
                              <>
                                <span className="btn-icon">⬇️</span>
                                Download Options
                              </>
                            )}
                          </button>
                        </div>

                        {selectedVideo === video.videoId && downloadFormats && (
                          <div className="download-formats">
                            <div className="formats-header">
                              <h4>📥 Available Formats</h4>
                              <button 
                                className="close-formats"
                                onClick={() => {
                                  setSelectedVideo(null)
                                  setDownloadFormats(null)
                                }}
                              >
                                ×
                              </button>
                            </div>
                            
                            <div className="formats-list">
                              {downloadFormats.medias
                                .filter(media => media.is_audio || media.type === 'video')
                                .slice(0, 6)
                                .map((media, idx) => (
                                <a
                                  key={idx}
                                  href={media.url}
                                  className="format-item"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                >
                                  <div className="format-info">
                                    <span 
                                      className="quality-badge"
                                      style={{background: getQualityBadgeColor(media.quality)}}
                                    >
                                      {media.quality}
                                    </span>
                                    <span className="format-type">
                                      {media.type === 'audio' ? '🎵 Audio' : '🎬 Video'}
                                    </span>
                                  </div>
                                  <div className="format-details">
                                    <span>{media.ext.toUpperCase()}</span>
                                    {media.width && <span>{media.width}x{media.height}</span>}
                                    <span>{formatFileSize(media.bitrate * media.duration / 8)}</span>
                                  </div>
                                  <span className="download-icon">⬇️</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {!loading && rawResponse && (
              <details className="raw">
                <summary>🔧 Debug: Show API Response Details</summary>
                <div className="debug-info">
                  <div className="debug-section">
                    <strong>API Status:</strong> {rawResponse.success ? '✅ Success' : '❌ Failed'}
                    {rawResponse.mock && ' (Using Sample Data)'}
                  </div>
                  {rawResponse.provider && (
                    <div className="debug-section">
                      <strong>Provider:</strong> {rawResponse.provider}
                      {rawResponse.creator && ` by ${rawResponse.creator}`}
                    </div>
                  )}
                  <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
                </div>
              </details>
            )}
          </section>
        </main>

        {/* CSS styles remain exactly the same as before */}
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
            padding-top: 2rem;
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
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.95), rgba(20, 20, 40, 0.95));
            padding: 2.5rem;
            border-radius: 20px;
            text-align: center;
            color: #fff;
            backdrop-filter: blur(12px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1);
            transition: all 300ms ease;
          }

          .page-wrapper.scrolled .search-inner {
            position: sticky;
            top: 18px;
            margin: 0 auto;
            padding: 1.5rem;
            border-radius: 16px;
            z-index: 100;
          }

          .header-content {
            margin-bottom: 1.5rem;
          }

          .title {
            margin: 0 0 0.5rem 0;
            font-size: 2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #fff 0%, #a8dadc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .subtitle {
            margin: 0 0 1rem 0;
            color: #e6e6e6;
            font-size: 1rem;
            opacity: 0.9;
          }

          .api-actions {
            margin-top: 0.5rem;
          }

          .mock-btn {
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .mock-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255,255,255,0.2);
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

          .search-icon {
            position: absolute;
            left: 1.2rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.2rem;
            opacity: 0.6;
            pointer-events: none;
          }

          .search-input {
            width: 100%;
            padding: 1rem 3rem 1rem 3rem;
            font-size: 1rem;
            border-radius: 999px;
            border: 2px solid rgba(255,255,255,0.1);
            outline: none;
            background: rgba(255,255,255,0.1);
            color: #fff;
            transition: all 0.3s ease;
          }

          .search-input:focus {
            border-color: rgba(74, 158, 255, 0.8);
            background: rgba(255,255,255,0.15);
            box-shadow: 0 0 0 4px rgba(74, 158, 255, 0.1);
          }

          .search-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .search-input::placeholder {
            color: rgba(255,255,255,0.5);
          }

          .clear-btn {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            line-height: 1;
            transition: all 0.2s ease;
          }

          .clear-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-50%) scale(1.1);
          }

          .search-btn {
            padding: 1rem 2rem;
            border-radius: 999px;
            border: none;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 140px;
            justify-content: center;
          }

          .search-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
          }

          .search-btn:active:not(:disabled) {
            transform: translateY(0px);
          }

          .search-btn:disabled {
            opacity: 0.5;
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

          .spinner.large {
            width: 32px;
            height: 32px;
            border-width: 3px;
          }

          .spinner.small {
            width: 14px;
            height: 14px;
            border-width: 2px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .hint {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: rgba(255,255,255,0.7);
          }

          .content-area {
            width: 100%;
            max-width: 1200px;
            margin: 1.5rem auto 4rem auto;
          }

          .status {
            color: #fff;
            background: rgba(0,0,0,0.5);
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
          }

          .status.loading {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
            border-color: rgba(102, 126, 234, 0.3);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .loading-details {
            font-size: 0.95rem;
            opacity: 0.8;
          }

          .status.error {
            background: rgba(220, 53, 69, 0.2);
            border-color: rgba(220, 53, 69, 0.3);
          }

          .error-content {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
            text-align: center;
          }

          .error-icon {
            font-size: 3rem;
          }

          .error-text {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .error-help {
            font-size: 0.95rem;
            opacity: 0.8;
            max-width: 500px;
          }

          .error-actions {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .retry-btn,
          .new-search-btn {
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .secondary-btn {
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.15);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .retry-btn:hover,
          .new-search-btn:hover {
            background: #fff;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255,255,255,0.3);
          }

          .secondary-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
          }

          .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2.5rem;
            padding: 0 0.5rem;
          }

          .results-title {
            color: #fff;
            font-size: 1.5rem;
            margin: 0;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .result-icon {
            font-size: 1.8rem;
          }

          .mock-badge {
            background: linear-gradient(135deg, #ffc107, #ff9800);
            color: #000;
            padding: 0.35rem 0.75rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 700;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 2rem;
          }

          .card {
            background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(245,245,255,0.98));
            color: #111;
            border-radius: 20px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(255,255,255,0.5);
          }

          .card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
          }

          .thumb-container {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .thumb {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
          }

          .card:hover .thumb {
            transform: scale(1.1);
          }

          .play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .card:hover .play-overlay {
            opacity: 1;
          }

          .play-icon {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: #667eea;
            padding-left: 4px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
          }

          .card:hover .play-icon {
            transform: scale(1.1);
          }

          .duration-badge {
            position: absolute;
            bottom: 12px;
            right: 12px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 0.4rem 0.8rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 700;
            backdrop-filter: blur(4px);
          }

          .card-content {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            flex: 1;
          }

          .video-title {
            font-size: 1.1rem;
            margin: 0;
            line-height: 1.4;
            font-weight: 700;
            color: #1a1a2e;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .channel-info {
            display: flex;
            align-items: center;
            gap: 0.6rem;
          }

          .channel-icon {
            font-size: 1rem;
          }

          .channel-name {
            color: #555;
            font-size: 0.95rem;
            font-weight: 600;
          }

          .meta-info {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            color: #666;
            font-size: 0.9rem;
            font-weight: 500;
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
            gap: 0.6rem;
            padding: 0.9rem;
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
          }

          .watch-btn:hover {
            background: linear-gradient(135deg, #cc0000, #990000);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
          }

          .download-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            padding: 0.9rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }

          .download-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, #764ba2, #667eea);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }

          .download-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .btn-icon {
            font-size: 1rem;
          }

          .download-formats {
            margin-top: 1rem;
            padding: 1.25rem;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 12px;
            border: 2px solid rgba(102, 126, 234, 0.2);
          }

          .formats-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .formats-header h4 {
            margin: 0;
            font-size: 1rem;
            font-weight: 700;
            color: #1a1a2e;
          }

          .close-formats {
            background: rgba(0, 0, 0, 0.1);
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            font-size: 1.5rem;
            line-height: 1;
            cursor: pointer;
            color: #666;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .close-formats:hover {
            background: rgba(0, 0, 0, 0.2);
            transform: scale(1.1);
          }

          .formats-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .format-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            background: white;
            border-radius: 10px;
            text-decoration: none;
            color: #1a1a2e;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }

          .format-item:hover {
            transform: translateX(4px);
            border-color: rgba(102, 126, 234, 0.3);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
          }

          .format-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .quality-badge {
            padding: 0.35rem 0.75rem;
            border-radius: 6px;
            color: white;
            font-size: 0.8rem;
            font-weight: 700;
            white-space: nowrap;
          }

          .format-type {
            font-weight: 600;
            font-size: 0.9rem;
          }

          .format-details {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.85rem;
            color: #666;
            font-weight: 500;
          }

          .download-icon {
            font-size: 1.2rem;
            opacity: 0.7;
            transition: all 0.3s ease;
          }

          .format-item:hover .download-icon {
            opacity: 1;
            transform: translateY(2px);
          }

          .raw {
            margin-top: 3rem;
            background: rgba(255,255,255,0.95);
            padding: 1.5rem;
            border-radius: 16px;
            color: #111;
            border: 1px solid rgba(0,0,0,0.1);
          }

          .debug-info {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .debug-section {
            padding: 0.75rem;
            background: #e9ecef;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
          }

          summary {
            cursor: pointer;
            font-weight: 700;
            padding: 0.75rem;
            border-radius: 10px;
            background: #f8f9fa;
            transition: all 0.3s ease;
            user-select: none;
          }

          summary:hover {
            background: #e9ecef;
            transform: translateX(4px);
          }

          pre {
            max-height: 400px;
            overflow: auto;
            white-space: pre-wrap;
            word-break: break-word;
            margin: 0;
            padding: 1.25rem;
            background: #f8f9fa;
            border-radius: 10px;
            font-size: 0.85rem;
            border: 1px solid #e9ecef;
            font-family: 'Courier New', monospace;
          }

          @media (max-width: 768px) {
            .page-wrapper {
              padding: 2rem 1rem;
            }

            .search-inner {
              padding: 2rem 1.5rem;
            }

            .title {
              font-size: 1.6rem;
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

            .results-title {
              font-size: 1.2rem;
            }

            .grid {
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 1.5rem;
            }

            .thumb-container {
              height: 180px;
            }

            .error-actions {
              flex-direction: column;
              width: 100%;
            }

            .retry-btn,
            .secondary-btn {
              width: 100%;
            }

            .format-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75rem;
            }

            .format-details {
              flex-wrap: wrap;
            }
          }

          @media (max-width: 480px) {
            .grid {
              grid-template-columns: 1fr;
            }
            
            .card-content {
              padding: 1.25rem;
            }

            .search-inner {
              padding: 1.5rem 1rem;
            }

            .title {
              font-size: 1.4rem;
            }

            .subtitle {
              font-size: 0.9rem;
            }
          }
        `}</style>
      </Layout>
    </>
  )
}
