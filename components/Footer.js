export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>WiFiPanel</h3>
          <p>Affordable, secure internet access powered by Nicholas</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="https://twitter.com/yourUsername" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://facebook.com/yourProfile" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.tiktok.com/@yourHandle" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} WiFiPanel by Nicholas. All rights reserved.</p>
      </div>

      <style jsx>{`
        .footer {
          background: #111;
          color: #eee;
          padding: 2rem;
          text-align: center;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 900px;
          margin: auto;
        }

        .footer-section h3, .footer-section h4 {
          margin-bottom: 0.5rem;
        }

        .footer-section p {
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section li {
          margin: 0.3rem 0;
        }

        .footer-section a {
          color: #00bfff;
          text-decoration: none;
        }

        .footer-section a:hover {
          text-decoration: underline;
        }

        .social-links {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .footer-bottom {
          margin-top: 2rem;
          font-size: 0.8rem;
          color: #aaa;
        }

        @media (min-width: 600px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }

          .social-links {
            flex-direction: row;
            gap: 1rem;
          }
        }
      `}</style>
    </footer>
  )
}
