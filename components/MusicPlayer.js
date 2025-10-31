// components/MusicPlayer.js
'use client'
import { useState, useRef, useEffect } from 'react'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const audioRef = useRef(null)

  const audioUrl = '/audio/my-track.mp3' // Replace with your actual file

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(error => console.log('Audio play failed:', error))
    }
    setIsPlaying(!isPlaying)
  }

  const updateProgress = () => {
    const audio = audioRef.current
    if (audio && audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100
      setProgress(progressPercent)
      setCurrentTime(formatTime(audio.currentTime))
    }
  }

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (audio) setDuration(formatTime(audio.duration))
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audio.currentTime = percent * audio.duration
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  return (
    <div className="music-player">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="player-controls">
        <button onClick={togglePlay} className="play-btn">
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <div className="progress-container">
          <span className="time-current">{currentTime}</span>
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="time-duration">{duration}</span>
        </div>
      </div>

      <div className="now-playing">
        <span>🎶 Now Playing: Sample Track</span>
      </div>

      <style jsx>{`
        .music-player {
          background: #1a1a2e;
          color: #fff;
          padding: 1rem;
          border-radius: 12px;
          max-width: 400px;
          margin: 2rem auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }

        .player-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .play-btn {
          font-size: 2rem;
          background: #00bfff;
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          cursor: pointer;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }

        .progress-bar {
          flex-grow: 1;
          height: 6px;
          background: #444;
          border-radius: 3px;
          cursor: pointer;
          position: relative;
        }

        .progress {
          height: 100%;
          background: #00bfff;
          border-radius: 3px;
        }

        .time-current, .time-duration {
          font-size: 0.8rem;
        }

        .now-playing {
          margin-top: 1rem;
          font-size: 0.9rem;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
