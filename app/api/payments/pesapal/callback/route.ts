import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addEmailToQueue } from "@/lib/email-service";
import { EmailType } from "@prisma/client";

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderTrackingId = searchParams.get("OrderTrackingId");
    const merchantReference = searchParams.get("OrderMerchantReference");

    if (!orderTrackingId) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/payment/failed?error=missing_tracking_id`
      );
    }

    // Get token and verify transaction
    const token = await getPesapalToken();
    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/payment/failed?error=verification_failed`
      );
    }

    const transactionStatus = await getTransactionStatus(token, orderTrackingId);

    if (!transactionStatus) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/payment/failed?error=status_check_failed`
      );
    }

    // Check payment status
    // Pesapal status codes: 0 = INVALID, 1 = COMPLETED, 2 = FAILED, 3 = REVERSED
    const paymentStatusCode = transactionStatus.payment_status_description;

    if (paymentStatusCode === "Completed" || transactionStatus.status_code === 1) {
      // Payment successful
      const userEmail = transactionStatus.payment_account; // Usually the email or phone

      // Try to find user by email from the merchant reference or billing info
      // The merchant reference format is: AILES-timestamp-random
      try {
        // Extract plan from merchant reference if possible
        const planId = merchantReference?.includes("premium") ? "premium" : 
                       merchantReference?.includes("standard") ? "standard" : 
                       merchantReference?.includes("mentorship") ? "mentorship" : "premium";

        // Find user and update subscription
        // Note: In production, you should store the user email with the order
        const subscriptionEnd = new Date();
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

        // Update user by finding them through their recent payment attempt
        // This is a simplified approach - in production, store user ID with the order
        if (transactionStatus.description) {
          const emailMatch = transactionStatus.description.match(/[\w.-]+@[\w.-]+\.\w+/);
          if (emailMatch) {
            const updatedUser = await prisma.user.update({
              where: { email: emailMatch[0] },
              data: {
                subscriptionStatus: "ACTIVE",
                subscriptionStartDate: new Date(),
                subscriptionExpiresAt: planId === "premium" ? subscriptionEnd : null,
                subscriptionTransactionId: orderTrackingId,
              },
            });

            // 🎉 NEW: Send payment receipt email
            try {
              await addEmailToQueue({
                userId: updatedUser.id,
                email: updatedUser.email,
                templateName: 'payment-receipt',
                type: EmailType.PAYMENT_RECEIPT,
                variables: {
                  firstName: updatedUser.name?.split(' ')[0] || 'there',
                  amount: transactionStatus.amount?.toString() || '0',
                  plan: planId,
                  transactionId: orderTrackingId,
                  date: new Date().toLocaleDateString(),
                },
              });
              console.log('Payment receipt email queued for:', updatedUser.email);
            } catch (emailError) {
              console.error('Failed to queue payment receipt:', emailError);
            }
          }
        }
      } catch (dbError) {
        console.error("Database update error:", dbError);
        // Continue anyway - payment was successful
      }

      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/payment/success?tx_ref=${merchantReference}&tracking_id=${orderTrackingId}`
      );
    } else if (paymentStatusCode === "Failed" || transactionStatus.status_code === 2) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/payment/failed?error=payment_failed&tx_ref=${merchantReference}`
      );
    } else {
      // Pending or other status
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/payment/pending?tx_ref=${merchantReference}&tracking_id=${orderTrackingId}`
      );
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/payment/failed?error=server_error`
    );
  }
}
