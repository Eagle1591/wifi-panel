'use client'
import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let mouse = { x: null, y: null }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initial resize
    resizeCanvas()

    // Handle window resize
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    })

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 1.5
        this.alpha = Math.random()
        this.speed = Math.random() * 0.02
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      update() {
        this.alpha += this.speed
        if (this.alpha > 1 || this.alpha < 0) this.speed *= -1
      }
    }

    class Comet {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = -50
        this.length = Math.random() * 80 + 50
        this.speed = Math.random() * 4 + 2
        this.angle = Math.PI / 4
        this.opacity = 1
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.strokeStyle = '#00ffff'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x - this.length * Math.cos(this.angle), this.y + this.length * Math.sin(this.angle))
        ctx.stroke()
        ctx.restore()
      }

      update() {
        this.x += this.speed
        this.y += this.speed
        this.opacity -= 0.01
        if (this.opacity <= 0) this.reset()
      }
    }

    const stars = Array.from({ length: 150 }, () => new Star())
    const comets = Array.from({ length: 3 }, () => new Comet())

    const drawMoon = () => {
      const moonX = canvas.width - 100
      const moonY = 100
      ctx.save()
      ctx.fillStyle = '#f5f3ce'
      ctx.shadowColor = '#f5f3ce'
      ctx.shadowBlur = 30
      ctx.beginPath()
      ctx.arc(moonX, moonY, 40, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawMouseGlow = () => {
      if (mouse.x && mouse.y) {
        ctx.save()
        ctx.fillStyle = 'rgba(255,255,255,0.05)'
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const animate = () => {
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawMoon()
      drawMouseGlow()

      stars.forEach(star => {
        star.update()
        star.draw()
      })

      comets.forEach(comet => {
        comet.update()
        comet.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', () => {})
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="animated-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  )
}
