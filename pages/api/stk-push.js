import axios from 'axios'

export default async function handler(req, res) {
  const { phone, amount } = req.body

  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
  const tokenRes = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  )

  const accessToken = tokenRes.data.access_token
  const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14)
  const password = Buffer.from(`174379${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64')

  const payload = {
    BusinessShortCode: '174379',
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: '174379',
    PhoneNumber: phone,
    CallBackURL: 'https://yourdomain.com/api/callback',
    AccountReference: 'WiFiPanel',
    TransactionDesc: 'Voucher Purchase'
  }

  const stkRes = await axios.post(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    payload,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  res.status(200).json(stkRes.data)
}
