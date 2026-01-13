import { NextRequest, NextResponse } from "next/server";

// Pesapal redirects the user here after checkout using the `callback_url`
// configured in `app/api/payments/pesapal/initiate/route.ts`.
//
// All *authoritative* payment status updates are handled via IPN at
// `/api/payments/pesapal/ipn`. This callback just sends the user to the
// appropriate UI page (success / pending / failed) based on query params.
//
// It must be safe during build and must not throw.

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // Try a few likely parameter names Pesapal might use
  const rawStatus =
    searchParams.get("status") ||
    searchParams.get("PaymentStatus") ||
    searchParams.get("payment_status") ||
    "";

  const normalizedStatus = rawStatus.toString().toLowerCase();

  let redirectPath = "/payment/pending";

  if (normalizedStatus.includes("success") || normalizedStatus.includes("complete")) {
    redirectPath = "/payment/success";
  } else if (normalizedStatus.includes("fail") || normalizedStatus.includes("cancel")) {
    redirectPath = "/payment/failed";
  }

  const redirectUrl = new URL(redirectPath, url.origin);

  return NextResponse.redirect(redirectUrl.toString());
}

