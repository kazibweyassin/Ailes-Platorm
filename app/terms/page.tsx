import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: December 8, 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Ailes Global's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              Ailes Global provides scholarship search, matching, and application support services to help students find and apply for educational opportunities. Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Scholarship database access and search</li>
              <li>Personalized scholarship matching</li>
              <li>Application guidance and support</li>
              <li>University matching services</li>
              <li>Educational resources and information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-600 mb-4">
              As a user of our services, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Provide accurate and truthful information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not misuse or attempt to manipulate our services</li>
              <li>Respect intellectual property rights</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Scholarship Information</h2>
            <p className="text-gray-600 mb-4">
              While we strive to provide accurate and up-to-date scholarship information, we cannot guarantee:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>The accuracy of all scholarship details</li>
              <li>The availability of any particular scholarship</li>
              <li>Your eligibility or selection for any scholarship</li>
              <li>The outcome of any application</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Users are responsible for verifying all information directly with scholarship providers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment and Fees</h2>
            <p className="text-gray-600 mb-4">
              Certain premium features may require payment. By purchasing our services, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Provide accurate payment information</li>
              <li>Pay all applicable fees</li>
              <li>Understand that fees are non-refundable unless otherwise stated</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content on Ailes Global, including text, graphics, logos, and software, is the property of Ailes Global or its content suppliers and is protected by intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              Ailes Global shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy</h2>
            <p className="text-gray-600 mb-4">
              Your use of our services is also governed by our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: info@ailesglobal.com<br />
              Phone: +256 786 367460<br />
              Address: Access Building Rubaga Road, Kampala, Uganda
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link href="/auth/signup">
            <Button size="lg">
              Accept and Create Account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
