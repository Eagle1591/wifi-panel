'use client'
import { useState } from 'react'

export default function BuyNowForm() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [voucher, setVoucher] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/stk-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount: 50 })
    })

    const data = await res.json()
    console.log('STK Push response:', data)

    // Simulate voucher generation after payment
    setTimeout(() => {
      setVoucher('WIFI-' + Math.random().toString(36).substr(2, 8).toUpperCase())
      setLoading(false)
    }, 5000)
  }

  return (
    <div className="buy-now-form">
      <form onSubmit={handleSubmit}>
        <label>Enter your phone number:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 254712345678"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Buy Now'}
        </button>
      </form>

      {voucher && (
        <div className="voucher-display">
          <h3>Your Voucher:</h3>
          <p>{voucher}</p>
        </div>
      )}
    </div>
  )
}
