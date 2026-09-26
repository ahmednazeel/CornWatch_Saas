
import React from "react";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-400">
            Legal
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Refund Policy
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: September 26, 2026
          </p>
        </div>

        {/* Content */}
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-10 lg:p-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              1. Paid Subscriptions
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch offers paid subscription plans that provide additional
              monitoring limits, monitoring frequency, notification options,
              and log retention.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              Subscriptions are billed according to the plan and billing
              period selected at checkout.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              2. Cancellation
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              You may cancel your subscription at any time using the available
              subscription management or billing options.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              When you cancel, your subscription will normally remain active
              until the end of the current paid billing period unless
              otherwise required by applicable law or stated at checkout.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              Cancellation does not automatically create a refund for the
              unused portion of the current billing period.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              3. Refund Requests
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              If you believe you were charged incorrectly or there is another
              billing issue, you may contact us and explain the issue.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              We will review refund requests on a case-by-case basis and
              provide refunds where required by applicable law or where we
              determine that a refund is appropriate.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              4. Duplicate or Incorrect Charges
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              If you believe you were charged more than once for the same
              subscription period or were charged an incorrect amount, please
              contact us as soon as possible.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              5. Payment Processing
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch payments are processed through Paddle. Paddle may act
              as the merchant of record and may handle payment processing,
              applicable taxes, refunds, and related billing matters.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              6. Free Plans
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch's free plan does not require payment and therefore is
              not eligible for a monetary refund.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              7. Statutory Rights
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              Nothing in this Refund Policy limits or removes any consumer
              rights or refund rights that cannot legally be excluded under
              applicable law.
            </p>
          </section>

          {/* Section 8 - Contact */}
          <section className="mt-10 rounded-xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="text-xl font-semibold text-white">
              8. Contact
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              For questions about a CornWatch charge or refund request, please
              contact us using one of the support options below.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {/* Email */}
              <a
                href="mailto:support@cornwatch.com"
                className="group inline-flex items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                  📧
                </span>

                <span>support@cornwatch.com</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/201234567890?text=Hello%20CornWatch%20Support%2C%20I%20have%20a%20refund%20question."
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                  💬
                </span>

                <span>WhatsApp Support</span>
              </a>
            </div>
          </section>
        </article>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} CornWatch. All rights reserved.
        </div>
      </div>
    </main>
  );
}

