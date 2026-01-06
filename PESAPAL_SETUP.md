# Pesapal Payment Setup Guide 🇺🇬

Pesapal is the #1 payment processor in East Africa, perfect for Uganda, Kenya, Tanzania, and Rwanda.

## Supported Payment Methods

- **MTN Mobile Money** 📱
- **Airtel Money** 📱  
- **Visa / Mastercard** 💳
- **Bank Transfer** 🏦

## Setup Steps

### 1. Create a Pesapal Account

1. Go to [https://www.pesapal.com](https://www.pesapal.com)
2. Click "Get Started" or "Sign Up for Business"
3. Choose your country (Uganda)
4. Complete the registration form

### 2. Get API Credentials

1. Log in to your Pesapal Dashboard
2. Go to **Settings** → **API Credentials**
3. For testing, use the **Sandbox** credentials
4. For production, apply for **Live** credentials

### 3. Add to Your Environment

Add these to your `.env` file:

```env
PESAPAL_CONSUMER_KEY="your-consumer-key-here"
PESAPAL_CONSUMER_SECRET="your-consumer-secret-here"
PESAPAL_ENV="sandbox"
```

### 4. Test Payments (Sandbox Mode)

Pesapal provides test credentials for the sandbox:

**Test Card:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVV: Any 3 digits

**Test Mobile Money:**
- Use the sandbox MTN/Airtel test numbers provided in your dashboard

### 5. Go Live

When ready for production:

1. Complete your business verification on Pesapal
2. Get your **Live** API credentials
3. Change `.env`:
   ```env
   PESAPAL_ENV="live"
   ```

## Pricing

| Payment Method | Fee |
|---------------|-----|
| Mobile Money | 1.5% - 3% |
| Cards (Local) | 2.9% |
| Cards (International) | 3.5% |

## Support

- **Email**: support@pesapal.com
- **Phone (UG)**: +256 312 263 643
- **Docs**: [developer.pesapal.com](https://developer.pesapal.com)

## Integration Endpoints

Your AILES platform now has:

| Endpoint | Purpose |
|----------|---------|
| `/api/payments/pesapal/initiate` | Start a payment |
| `/api/payments/pesapal/callback` | Handle payment return |
| `/api/payments/pesapal/ipn` | Receive payment notifications |
| `/payment/checkout` | Payment page |
| `/payment/success` | Success page |
| `/payment/failed` | Failed page |
| `/payment/pending` | Pending page (Mobile Money) |

## How It Works

1. User selects a plan on `/pricing`
2. Redirected to `/payment/checkout`
3. Chooses payment method (Mobile Money, Card, Bank)
4. Clicks Pay → Redirected to Pesapal
5. Completes payment
6. Pesapal sends IPN notification
7. User redirected back to success/pending/failed page
8. Subscription activated automatically

---

**Note**: Mobile Money payments may take 1-2 minutes to process. The pending page handles this gracefully.
