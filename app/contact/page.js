'use client'
import Layout from '../../components/Layout'
import AnimatedBackground from '../../components/AnimatedBackground'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function Contact() {
  return (
    <>
      <AnimatedBackground />
      <Layout>
        <div className="contact-page">
          <h1>📬 Contact Us</h1>
          <p>We’d love to hear from you. Reach out anytime.</p>

          <div className="contact-grid">
            {/* Contact Form */}
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Your email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Your message" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>

            {/* Reach Out Info */}
            <div className="contact-info">
              <h3>📞 Reach Us</h3>
              <p><FaPhone /> +254 712 345 678</p>
              <p><FaEnvelope /> support@wifipanel.co.ke</p>
              <p><FaMapMarkerAlt /> Kutus, Kirinyaga County, Kenya</p>

              <h4>Connect with us</h4>
              <div className="social-icons">
                <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      <style jsx>{`
        .contact-page {
          padding: 2rem;
          max-width: 1000px;
          margin: auto;
          text-align: center;
        }

        .contact-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 2rem;
        }

        .contact-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .form-group label {
          margin-bottom: 0.3rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.6rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }

        .btn-primary {
          background: #0070f3;
          color: white;
          padding: 0.7rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .contact-info {
          flex: 1;
          text-align: left;
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .contact-info p {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-icons a {
          color: #0070f3;
          font-size: 1.5rem;
          transition: transform 0.2s ease;
        }

        .social-icons a:hover {
          transform: scale(1.2);
          color: #4ecdc4;
        }

        @media (min-width: 768px) {
          .contact-grid {
            flex-direction: row;
            align-items: flex-start;
          }

          .contact-form,
          .contact-info {
            width: 48%;
          }
        }
      `}</style>
    </>
  )
}
