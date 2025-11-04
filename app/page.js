'use client'
import { useState } from 'react'
import Layout from '../components/Layout'
import AnimatedBackground from '../components/AnimatedBackground'
import BuyNowModal from '../components/BuyNowModal'
import { FaFacebook, FaWhatsapp, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa'
import Footer from '../components/Footer'

const wifiPlans = [
  { label: '1 Hour', price: 10, duration: '1hr', mbs: '20 MBPS' },
  { label: '2 Hours', price: 15, duration: '2hrs', mbs: '20 MBPS' },
  { label: '4 Hours', price: 20, duration: '4hrs', mbs: '20 MBPS' },
  { label: '6 Hours', price: 40, duration: '6hrs', mbs: '20 MBPS' },
  { label: '12 Hours', price: 55, duration: '12hrs', mbs: '20 MBPS' },
  { label: '1 Day', price: 70, duration: '24hrs', mbs: '20 MBPS' },
  { label: '3 Days', price: 130, duration: '72hrs', mbs: '20 MBPS' },
  { label: '1 Week', price: 190, duration: '168hrs', mbs: '20 MBPS' },
]

export default function WifiBillingPanel() {
  const [selectedPlan, setSelectedPlan] = useState(null)

  return (
    <>
      <AnimatedBackground />
      <Layout>
        <div className="store-page">
          <header className="hero">
            <h1>📡 WiFi Billing Panel</h1>
            <p>Affordable internet access — pay as you go</p>
          </header>

          <section className="plans-grid">
            {wifiPlans.map((plan, index) => (
              <div key={index} className="plan-box">
                <h2>{plan.label}</h2>
                <p className="price">Ksh {plan.price}</p>
                <p className="details">Max: {plan.mbs}</p>
                <button className="btn-primary" onClick={() => setSelectedPlan(plan)}>
                  Buy Now
                </button>
              </div>
            ))}
          </section>

          <section className="user-client">
            <h2>🔐 Login</h2>
            <form className="auth-form">
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <button className="btn-secondary">Login</button>
              <p>New here? <a href="#">Register</a></p>
            </form>
          </section>

          <section className="mpesa-voucher">
            <h2>📲 M-Pesa Voucher</h2>
            <form className="voucher-form">
              <input type="text" placeholder="Enter Voucher Code" required />
              <button className="btn-primary">Redeem</button>
            </form>
          </section>

          <section className="social-links">
            <a href="https://wa.me/254712345678" target="_blank" rel="noopener noreferrer"><FaWhatsapp size={24} /></a>
            <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer"><FaFacebook size={24} /></a>
            <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer"><FaTwitter size={24} /></a>
            <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer"><FaInstagram size={24} /></a>
            <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer"><FaGlobe size={24} /></a>
          </section>

          {selectedPlan && (
            <BuyNowModal
              plan={selectedPlan}
              onClose={() => setSelectedPlan(null)}
            />
          )}
        </div>
        {selectedPlan && (
  <BuyNowModal
    plan={selectedPlan}
    onClose={() => setSelectedPlan(null)}
  />
)}

<Footer />

      </Layout>

      <style jsx>{`
        .store-page {
          padding: 2rem;
          text-align: center;
        }

        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }

        .plan-box {
          background: #07a909ff;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .plan-box:hover {
          transform: translateY(-5px);
        }

        .price {
          font-size: 1.2rem;
          margin: 0.5rem 0;
        }

        .details {
          font-size: 0.9rem;
          color: #555;
        }

        .btn-primary {
          background: #0070f3;
          color: yellow;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .user-client, .mpesa-voucher {
          margin-top: 3rem;
        }

        .auth-form, .voucher-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          max-width: 300px;
          margin: auto;
        }

        .auth-form input, .voucher-form input {
          padding: 0.5rem;
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .btn-secondary {
          background: #555;
          color: green;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        a {
          color: #0070f3;
          text-decoration: underline;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .social-links a {
          color: white;
          transition: transform 0.2s ease;
        }

        .social-links a:hover {
          transform: scale(1.2);
          color: #4ecdc4;
        }
      `}</style>
    </>
  )
}
