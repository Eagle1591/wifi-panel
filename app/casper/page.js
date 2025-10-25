"use client"

import Layout from '../../components/Layout'
import Link from 'next/link'
import { useState } from 'react'

export default function Downloader() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`https://casper-tech-apis.vercel.app/api/play/youtube2?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.success) {
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
      <Layout>
        <section className="downloader-section">
          <div className="section-container">
            <h1 className="page-title">🎬 YouTube Downloader</h1>
            <p className="page-subtitle">Search and download your favorite YouTube videos in MP3 or MP4</p>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Enter video title or keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={handleSearch} className="btn-primary">🔍 Search</button>
            </div>

            {loading && <p>Loading results...</p>}

            <div className="results-grid">
              {results.map((video, index) => (
                <div key={index} className="video-card">
                  <img src={video.thumbnail} alt={video.title} className="video-thumb" />
                  <h3>{video.title}</h3>
                  <p><strong>Channel:</strong> {video.channel}</p>
                  <p><strong>Duration:</strong> {video.duration}</p>
                  <p><strong>Views:</strong> {video.views}</p>
                  <div className="download-links">
                    {video.downloads?.mp3 && (
                      <a href={video.downloads.mp3} target="_blank" rel="noopener noreferrer" className="btn-secondary">🎵 Download MP3</a>
                    )}
                    {video.downloads?.mp4 && (
                      <a href={video.downloads.mp4} target="_blank" rel="noopener noreferrer" className="btn-secondary">🎥 Download MP4</a>
                    )}
                    {!video.downloads?.mp3 && !video.downloads?.mp4 && (
                      <span className="no-download">No downloads available</span>
                    )}
                  </div>
                  <Link href={video.url} target="_blank" className="video-link">🔗 Watch on YouTube</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
