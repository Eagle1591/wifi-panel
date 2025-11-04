'use client'
import { useState } from 'react'

export default function BuyNowForm({ amount, label }) {
  const [step, setStep] = useState('start')
  const [phone, setPhone] = useState('')
  const [voucher, setVoucher] = useState(null)

  const handleBuyClick = () => {
    console.log(`Buy Now clicked for ${label} @ Ksh ${amount}`)
    setStep('input')
  }

  const handlePayClick = async (e) => {
    e.preventDefault()
    setStep('waiting')

    const res = await fetch('/api/stk-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount })
    })

    const data = await res.json()
    console.log('STK Push response:', data)

    setTimeout(() => {
      const code = `${label.toUpperCase()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      setVoucher(code)
      setStep('done')
    }, 7000)
  }

  return (
    <div className="buy-now-flow" style={{ position: 'relative', zIndex: 1001 }}>
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
          <button type="submit">Pay Ksh {amount}</button>
        </form>
      )}

      {step === 'waiting' && <p>Waiting for payment confirmation...</p>}
      {step === 'done' && <p>Your voucher: <strong>{voucher}</strong></p>}
    </div>
  )
}
