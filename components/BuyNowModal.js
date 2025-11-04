'use client'
import { useState } from 'react'

export default function BuyNowModal({ plan, onClose }) {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState('input')
  const [voucher, setVoucher] = useState(null)

  const handlePayClick = async (e) => {
    e.preventDefault()
    setStep('waiting')

    const res = await fetch('/api/stk-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount: plan.price })
    })

    const data = await res.json()
    console.log('STK Push response:', data)

    setTimeout(() => {
      const code = `${plan.label.toUpperCase()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      setVoucher(code)
      setStep('done')
    }, 7000)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>{plan.label} — Ksh {plan.price}</h2>

        {step === 'input' && (
          <form onSubmit={handlePayClick}>
            <label>Enter your phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 254712345678"
              required
            />
            <button type="submit">Pay Now</button>
          </form>
        )}

        {step === 'waiting' && <p>Waiting for payment confirmation...</p>}
        {step === 'done' && <p>Your voucher: <strong>{voucher}</strong></p>}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
        }

        input {
          padding: 0.5rem;
          width: 100%;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        button {
          background: #0070f3;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
