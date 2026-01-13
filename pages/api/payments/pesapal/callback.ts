import type { NextApiRequest, NextApiResponse } from "next";

// Classic Pages API route to avoid App Router export issues on Vercel.
// Pesapal redirects the user here after checkout using the `callback_url`
// configured in `app/api/payments/pesapal/initiate/route.ts`.
//
// All authoritative payment status updates are handled via the IPN endpoint.
// This route only redirects the user to the appropriate UI page.

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { status, PaymentStatus, payment_status } = req.query;

  const rawStatus =
    (status as string | undefined) ||
    (PaymentStatus as string | undefined) ||
    (payment_status as string | undefined) ||
    "";

  const normalizedStatus = rawStatus.toLowerCase();

  let redirectPath = "/payment/pending";
  if (normalizedStatus.includes("success") || normalizedStatus.includes("complete")) {
    redirectPath = "/payment/success";
  } else if (normalizedStatus.includes("fail") || normalizedStatus.includes("cancel")) {
    redirectPath = "/payment/failed";
  }

  res.redirect(302, redirectPath);
}

