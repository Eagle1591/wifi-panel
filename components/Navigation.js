'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link href="/">WiFiPanel</Link>
          </div>

          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            {navItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-link ${pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          background: #0a0a1a;
          color: #fff;
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: auto;
        }

        .nav-logo a {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00bfff;
          text-decoration: none;
        }

        .nav-menu {
          display: flex;
          gap: 1.5rem;
        }

        .nav-link {
          color: #ccc;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #00bfff;
        }

        .nav-link.active {
          color: #00bfff;
          border-bottom: 2px solid #00bfff;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background: #fff;
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .nav-menu {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: #0a0a1a;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 1rem 0;
            display: none;
          }

          .nav-menu.active {
            display: flex;
          }

          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </>
  )
}
