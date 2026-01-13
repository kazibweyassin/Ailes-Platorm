import { NextRequest, NextResponse } from "next/server";

// Pesapal redirects the user here after checkout using the `callback_url`
// configured in `app/api/payments/pesapal/initiate/route.ts`.
//
// All *authoritative* payment status updates are handled via IPN at
// `/api/payments/pesapal/ipn`. This callback just sends the user to the
// appropriate UI page (success / pending / failed) based on query params.
//
// CRITICAL: This route must never be statically analyzed during build.
// Using Edge runtime and force-dynamic to ensure it's never pre-rendered.

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  // Extract query params without using URL constructor during build analysis
  const urlString = req.url || '';
  const queryString = urlString.includes('?') ? urlString.split('?')[1] : '';
  const params = new URLSearchParams(queryString);

  // Try a few likely parameter names Pesapal might use
  const rawStatus =
    params.get("status") ||
    params.get("PaymentStatus") ||
    params.get("payment_status") ||
    "";

  const normalizedStatus = rawStatus.toLowerCase();

  // Determine redirect path
  let redirectPath = "/payment/pending";
  if (normalizedStatus.includes("success") || normalizedStatus.includes("complete")) {
    redirectPath = "/payment/success";
  } else if (normalizedStatus.includes("fail") || normalizedStatus.includes("cancel")) {
    redirectPath = "/payment/failed";
  }

  // Return HTML with client-side redirect - no server-side redirects
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0;url=${redirectPath}">
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Redirecting… If you are not redirected automatically, <a href="${redirectPath}">click here</a>.</p>
    <script>window.location.href = ${JSON.stringify(redirectPath)};</script>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

