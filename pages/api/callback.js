export default async function handler(req, res) {
  console.log('M-Pesa callback received:', req.body)
  res.status(200).send('Callback received')
}
