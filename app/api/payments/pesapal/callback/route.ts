import { NextRequest, NextResponse } from "next/server";

// Pesapal redirects the user here after checkout using the `callback_url`
// configured in `app/api/payments/pesapal/initiate/route.ts`.
//
// All *authoritative* payment status updates are handled via IPN at
// `/api/payments/pesapal/ipn`. This callback just sends the user to the
// appropriate UI page (success / pending / failed) based on query params.
//
// It must be safe during build and must not throw. To keep the Next.js export
// step on Vercel happy, we avoid using NextResponse.redirect (which shows up
// in your stack trace) and instead return a tiny HTML page that performs a
// client-side redirect.

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
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

    const redirectUrl = new URL(redirectPath, url.origin).toString();

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="refresh" content="0;url=${redirectUrl}" />
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Redirecting… If you are not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
    <script>window.location.href = ${JSON.stringify(redirectUrl)};</script>
  </body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Pesapal callback error:", error);

    // Fallback: simple OK response so build/export never fails
    return NextResponse.json({ ok: true });
  }
}

