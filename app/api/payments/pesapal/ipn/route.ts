import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
const PESAPAL_ENV = process.env.PESAPAL_ENV || "sandbox";

const PESAPAL_BASE_URL = PESAPAL_ENV === "live" 
  ? "https://pay.pesapal.com/v3"
  : "https://cybqa.pesapal.com/pesapalv3";

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
    return data.token || null;
  } catch (error) {
    console.error("Failed to get Pesapal token:", error);
    return null;
  }
}

// Get Transaction Status
async function getTransactionStatus(token: string, orderTrackingId: string) {
  try {
    const response = await fetch(
      `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Failed to get transaction status:", error);
    return null;
  }
}

// IPN (Instant Payment Notification) Handler
// Pesapal sends notifications here when payment status changes
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderTrackingId = searchParams.get("OrderTrackingId");
    const merchantReference = searchParams.get("OrderMerchantReference");
    const notificationType = searchParams.get("OrderNotificationType");

    console.log("Pesapal IPN received:", {
      orderTrackingId,
      merchantReference,
      notificationType,
    });

    if (!orderTrackingId) {
      return NextResponse.json({ status: "error", message: "Missing order tracking ID" });
    }

    // Get token
    const token = await getPesapalToken();
    if (!token) {
      return NextResponse.json({ status: "error", message: "Failed to authenticate" });
    }

    // Get transaction status
    const transactionStatus = await getTransactionStatus(token, orderTrackingId);

    if (!transactionStatus) {
      return NextResponse.json({ status: "error", message: "Failed to get status" });
    }

    console.log("Transaction status:", transactionStatus);

    // Process completed payments
    if (transactionStatus.payment_status_description === "Completed" || transactionStatus.status_code === 1) {
      try {
        // Determine plan type from amount
        const amount = transactionStatus.amount || 0;
        let planType = "premium";
        if (amount >= 500) planType = "mentorship";
        else if (amount >= 200) planType = "standard";

        const subscriptionEnd = new Date();
        if (planType === "premium") {
          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
        } else {
          // One-time purchases get longer access
          subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
        }

        // Try to find user by email from description or payment account
        let userEmail: string | null = null;
        
        if (transactionStatus.description) {
          const emailMatch = transactionStatus.description.match(/[\w.-]+@[\w.-]+\.\w+/);
          if (emailMatch) userEmail = emailMatch[0];
        }

        if (userEmail) {
          await prisma.user.update({
            where: { email: userEmail },
            data: {
              subscriptionStatus: "ACTIVE",
              subscriptionStartDate: new Date(),
              subscriptionExpiresAt: subscriptionEnd,
              subscriptionTransactionId: orderTrackingId,
            },
          });
          
          console.log(`User ${userEmail} subscription updated to ACTIVE`);
        }

        // Also create a Payment record for tracking
        // Note: You would need to add Payment model to schema if not exists
        
      } catch (dbError) {
        console.error("IPN database update error:", dbError);
      }
    }

    // Pesapal expects a specific response format
    return NextResponse.json({
      orderNotificationType: notificationType,
      orderTrackingId: orderTrackingId,
      orderMerchantReference: merchantReference,
      status: "200",
    });
  } catch (error) {
    console.error("IPN handler error:", error);
    return NextResponse.json({ status: "error", message: "Server error" });
  }
}
