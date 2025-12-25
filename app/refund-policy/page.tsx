import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Refund & Cancellation Policy</h1>
      <p className="mb-4 text-gray-700">
        At Ailes Global, we are committed to providing high-quality services and support to all our clients. Please read our Refund & Cancellation Policy carefully before making any payments.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">1. Service Fees</h2>
      <p className="mb-4 text-gray-700">
        All service fees paid to Ailes Global for application support, university matching, or related services are non-refundable once the service has commenced or access to digital resources has been granted.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">2. Cancellation by Client</h2>
      <p className="mb-4 text-gray-700">
        If you wish to cancel a service before it has commenced, please contact us immediately at <a href="mailto:info@ailesglobal.com" className="text-primary underline">info@ailesglobal.com</a>. Cancellations requested before service delivery may be eligible for a partial refund, subject to administrative fees and at our discretion.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">3. Digital Products & Downloads</h2>
      <p className="mb-4 text-gray-700">
        Payments for digital products, downloadable resources, or online courses are non-refundable once access has been provided.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">4. Exceptional Circumstances</h2>
      <p className="mb-4 text-gray-700">
        In rare cases of technical errors, duplicate payments, or proven service failure, please contact us within 7 days of payment. We will review your request and process a refund if deemed appropriate.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">5. Contact Us</h2>
      <p className="mb-4 text-gray-700">
        For any questions or to request a cancellation/refund, email us at <a href="mailto:info@ailesglobal.com" className="text-primary underline">info@ailesglobal.com</a> or call +256 786 367460.
      </p>
      <p className="text-xs text-gray-500 mt-8">This policy is subject to change. Please review this page regularly for updates.</p>
    </div>
  );
}
