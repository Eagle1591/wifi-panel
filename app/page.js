import Layout from '../components/Layout'
import AnimatedBackground from '../components/AnimatedBackground'

const plans = [
  { ram: '2 GB', price: '$0.40' },
  { ram: '4 GB', price: '$0.80' },
  { ram: '8 GB', price: '$1.60' },
  { ram: '16 GB', price: '$3.20' },
  { ram: '32 GB', price: '$6.40' },
  { ram: '64 GB', price: '$12.80' },
  { ram: '128 GB', price: '$25.60' },
  { ram: '256 GB', price: '$51.20' },
  { ram: '512 GB', price: '$102.40' },
  { ram: 'Unlimited', price: 'Contact Us' },
]

export default function PanelStore() {
  return (
    <>
      <AnimatedBackground />
      <Layout>
        <div className="store-page">
          <header className="hero">
            <h1>🚀 Panel Store</h1>
            <p>Choose your power. Scale infinitely.</p>
          </header>

          <section className="plans">
            {plans.map((plan, index) => (
              <div key={index} className="plan-box">
                <h2>{plan.ram} RAM</h2>
                <p className="price">{plan.price}</p>
                <button className="btn-primary">Buy Now</button>
              </div>
            ))}
          </section>

          <section className="user-client">
            <h2>👤 User Client</h2>
            <form className="auth-form">
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <button className="btn-secondary">Login</button>
              <p>New here? <a href="#">Register</a></p>
            </form>
          </section>
        </div>
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

        .plans {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .plan-box {
          background: #f0f0f0;
          border-radius: 8px;
          padding: 1rem 2rem;
          width: 300px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .plan-box:hover {
          transform: translateY(-5px);
        }

        .price {
          font-size: 1.2rem;
          margin: 0.5rem 0;
        }

        .btn-primary {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .user-client {
          margin-top: 3rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          max-width: 300px;
          margin: auto;
        }

        .auth-form input {
          padding: 0.5rem;
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .btn-secondary {
          background: #555;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }

        a {
          color: #0070f3;
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
