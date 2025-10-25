"use client"

import Layout from '../../components/Layout'
import AnimatedBackground from '../../components/AnimatedBackground'
import { useState } from 'react'

export default function Downloader() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`https://casper-tech-apis.vercel.app/api/play/youtube2?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.success && data.videos) {
        setResults(data.videos)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('API error:', error)
      setResults([])
    }
    setLoading(false)
  }

  return (
    <>
      <AnimatedBackground />
      <Layout>
        <section className={`downloader-wrapper ${searched ? 'searched' : ''}`}>
          <div className="search-container">
            <h1 className="page-title">🎬 YouTube Downloader</h1>
            <p className="page-subtitle">Search and download YouTube videos in MP3 or MP4</p>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search YouTube..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>

          {loading && <p className="loading-text">🔄 Fetching results...</p>}

          <div className="results-grid">
            {results.map((video, index) => (
              <div key={index} className="video-card">
                <img src={video.thumbnail} alt={video.title} />
                <h3>{video.title}</h3>
                <p><strong>Channel:</strong> {video.channel}</p>
                <p><strong>Duration:</strong> {video.duration}</p>
                <p><strong>Views:</strong> {video.views}</p>
                <div className="download-links">
                  {video.downloads?.mp3 && (
                    <a href={video.downloads.mp3} target="_blank" rel="noopener noreferrer">🎵 MP3</a>
                  )}
                  {video.downloads?.mp4 && (
                    <a href={video.downloads.mp4} target="_blank" rel="noopener noreferrer">🎥 MP4</a>
                  )}
                  {!video.downloads?.mp3 && !video.downloads?.mp4 && (
                    <span className="no-download">No downloads available</span>
                  )}
                </div>
                <a href={video.url} target="_blank" rel="noopener noreferrer" className="watch-link">🔗 Watch on YouTube</a>
              </div>
            ))}
          </div>
        </section>

        {/* Inline CSS */}
        <style jsx>{`
          .downloader-wrapper {
            min-height: 100vh;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .downloader-wrapper.searched {
            justify-content: flex-start;
            padding-top: 6rem;
          }

          .search-container {
            text-align: center;
            max-width: 600px;
            width: 100%;
          }

          .page-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #fff;
          }

          .page-subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            color: #ddd;
          }

          .search-bar {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }

          .search-bar input {
            flex: 1;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border-radius: 8px;
            border: none;
            outline: none;
          }

          .search-bar button {
            padding: 0.75rem 1.2rem;
            font-size: 1rem;
            background-color: #0070f3;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }

          .loading-text {
            margin-top: 2rem;
            color: #fff;
            font-size: 1.2rem;
          }

          .results-grid {
            margin-top: 3rem;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            width: 100%;
            max-width: 1200px;
          }

          .video-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: center;
          }

          .video-card img {
            width: 100%;
            border-radius: 8px;
            margin-bottom: 1rem;
          }

          .download-links {
            margin-top: 1rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .download-links a {
            background-color: #0070f3;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            text-decoration: none;
          }

          .no-download {
            color: #999;
            font-style: italic;
          }

          .watch-link {
            display: block;
            margin-top: 1rem;
            color: #0070f3;
            text-decoration: underline;
          }
        `}</style>
      </Layout>
    </>
  )
}
