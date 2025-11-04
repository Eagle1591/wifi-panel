'use client'
import { useState } from 'react'

export default function BuyNowForm() {
  const [step, setStep] = useState('start') // 'start' | 'input' | 'waiting' | 'done'
  const [phone, setPhone] = useState('')
  const [voucher, setVoucher] = useState(null)

  const handleBuyClick = () => {
    setStep('input')
  }

  const handlePayClick = async (e) => {
    e.preventDefault()
    setStep('waiting')

    const res = await fetch('/api/stk-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount: 50 })
    })

    const data = await res.json()
    console.log('STK Push response:', data)

    // Simulate waiting for payment confirmation
    setTimeout(() => {
      const code = 'WIFI-' + Math.random().toString(36).substr(2, 8).toUpperCase()
      setVoucher(code)
      setStep('done')
    }, 7000)
  }

  return (
    <div className="buy-now-flow">
      {step === 'start' && (
        <button className="buy-button" onClick={handleBuyClick}>
          Buy Now
        </button>
      )}

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

      {step === 'waiting' && (
        <div className="waiting">
          <p>Waiting for payment confirmation...</p>
        </div>
      )}

      {step === 'done' && (
        <div className="voucher">
          <h3>Payment confirmed ✅</h3>
          <p>Your voucher: <strong>{voucher}</strong></p>
        </div>
      )}

      <style jsx>{`
        .buy-now-flow {
          text-align: center;
          margin-top: 2rem;
        }

        input {
          padding: 0.5rem;
          font-size: 1rem;
          border-radius: 6px;
          border: 1px solid #ccc;
          width: 250px;
          margin-bottom: 1rem;
        }

        button {
          background: #00bfff;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
        }

        .waiting {
          font-style: italic;
          color: #555;
        }

        .voucher {
          margin-top: 1rem;
          font-size: 1.2rem;
          color: green;
        }
      `}</style>
    </div>
  )
}
