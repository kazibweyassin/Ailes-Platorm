import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Pesapal API Configuration
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
const PESAPAL_ENV = process.env.PESAPAL_ENV || "sandbox"; // "sandbox" or "live"

const PESAPAL_BASE_URL = PESAPAL_ENV === "live" 
  ? "https://pay.pesapal.com/v3"
  : "https://cybqa.pesapal.com/pesapalv3";

interface PaymentPlan {
  name: string;
  amount: number;
  currency: string;
  description: string;
  type: "subscription" | "one-time";
}

const PAYMENT_PLANS: Record<string, PaymentPlan> = {
  premium: {
    name: "Premium Access",
    amount: 5,
    currency: "USD",
    description: "Monthly premium access - Checklists, AI Copilot, WhatsApp Alerts",
    type: "subscription",
  },
  premium_ugx: {
    name: "Premium Access (UGX)",
    amount: 18500,
    currency: "UGX",
    description: "Monthly premium access - Checklists, AI Copilot, WhatsApp Alerts",
    type: "subscription",
  },
  standard: {
    name: "Standard Package",
    amount: 299,
    currency: "USD",
    description: "Full service - Expert consultation, SOP writing, 3-5 applications",
    type: "one-time",
  },
  standard_ugx: {
    name: "Standard Package (UGX)",
    amount: 1100000,
    currency: "UGX",
    description: "Full service - Expert consultation, SOP writing, 3-5 applications",
    type: "one-time",
  },
  mentorship: {
    name: "Premium Mentorship",
    amount: 799,
    currency: "USD",
    description: "Complete concierge service with dedicated mentor",
    type: "one-time",
  },
  mentorship_ugx: {
    name: "Premium Mentorship (UGX)",
    amount: 2950000,
    currency: "UGX",
    description: "Complete concierge service with dedicated mentor",
    type: "one-time",
  },
};

// Get Pesapal Access Token
async function getPesapalToken(): Promise<string | null> {
  try {
    const response = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET,
      }),
    });

    const data = await response.json();
    
    if (data.token) {
      return data.token;
    }
    
    console.error("Pesapal token error:", data);
    return null;
  } catch (error) {
    console.error("Failed to get Pesapal token:", error);
    return null;
  }
}

// Register IPN (Instant Payment Notification) URL
async function registerIPN(token: string): Promise<string | null> {
  try {
    const ipnUrl = `${process.env.NEXTAUTH_URL}/api/payments/pesapal/ipn`;
    
    const response = await fetch(`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: "GET",
      }),
    });

    const data = await response.json();
    
    if (data.ipn_id) {
      return data.ipn_id;
    }
    
    console.error("IPN registration error:", data);
    return null;
  } catch (error) {
    console.error("Failed to register IPN:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Please sign in to make a payment" },
        { status: 401 }
      );
    }

    const { planId, paymentMethod } = await req.json();

    if (!planId || !PAYMENT_PLANS[planId]) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Get access token
    const token = await getPesapalToken();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to initialize payment. Please try again." },
        { status: 500 }
      );
    }

    // Register IPN URL
    const ipnId = await registerIPN(token);
    if (!ipnId) {
      return NextResponse.json(
        { error: "Failed to setup payment notifications. Please try again." },
        { status: 500 }
      );
    }

    const plan = PAYMENT_PLANS[planId];
    const merchantReference = `AILES-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Submit Order Request
    const orderRequest = {
      id: merchantReference,
      currency: plan.currency,
      amount: plan.amount,
      description: plan.description,
      callback_url: `${process.env.NEXTAUTH_URL}/api/payments/pesapal/callback`,
      notification_id: ipnId,
      billing_address: {
        email_address: session.user.email,
        first_name: session.user.name?.split(" ")[0] || "Student",
        last_name: session.user.name?.split(" ").slice(1).join(" ") || "",
        country_code: "UG",
      },
    };

    const submitResponse = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(orderRequest),
    });

    const submitData = await submitResponse.json();

    if (submitData.redirect_url) {
      return NextResponse.json({
        success: true,
        paymentLink: submitData.redirect_url,
        orderTrackingId: submitData.order_tracking_id,
        merchantReference: merchantReference,
      });
    } else {
      console.error("Pesapal submit error:", submitData);
      return NextResponse.json(
        { error: submitData.error?.message || "Failed to create payment. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
