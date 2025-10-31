// ./app/api/redeem/route.js
export async function POST(req) {
  const { voucher } = await req.json();

  // Simulate voucher lookup
  const validVouchers = {
    "MPESA123": { duration: "1hr", price: 10 },
    "MPESA456": { duration: "1day", price: 70 },
  };

  if (validVouchers[voucher]) {
    return Response.json({ success: true, plan: validVouchers[voucher] });
  } else {
    return Response.json({ success: false, message: "Invalid voucher" }, { status: 400 });
  }
}
