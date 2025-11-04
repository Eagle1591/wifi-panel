import '../styles/globals.css'

export const metadata = {
  title: 'WiFiPanel — Affordable Internet Access',
  description: 'Pay-as-you-go internet with secure M-Pesa integration and voucher delivery',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
        {children}
        <div id="modal-root" />
      </body>
    </html>
  )
}
