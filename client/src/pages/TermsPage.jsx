// import React from "react";

// export default function TermsPage() {
//   return (
//     <main className="legal-page">
//       {" "}
//       <div className="legal-container">
//         {" "}
//         <h1>Terms of Service</h1>{" "}
//         <p className="legal-updated">Last updated: September 26, 2026</p>
//         <p>
//           Welcome to CornWatch. These Terms of Service ("Terms") govern your
//           access to and use of the CornWatch website, application, and related
//           services ("Service").
//         </p>
//         <p>
//           By creating an account or using CornWatch, you agree to these Terms.
//         </p>
//         <h2>1. The Service</h2>
//         <p>
//           CornWatch is a cloud-based website and service reliability monitoring
//           platform.
//         </p>
//         <p>
//           CornWatch allows users to add websites and online services that they
//           own or are authorized to manage. The Service performs automated
//           availability and health checks and can notify users when an issue is
//           detected.
//         </p>
//         <h2>2. Account Registration</h2>
//         <p>You agree to:</p>
//         <ul>
//           <li>Provide accurate information when creating your account.</li>
//           <li>Keep your account credentials secure.</li>
//           <li>Not share your account credentials with unauthorized users.</li>
//           <li>Notify us if you believe your account has been compromised.</li>
//           <li>Be responsible for activity performed through your account.</li>
//         </ul>
//         <h2>3. Authorized Use</h2>
//         <p>
//           You may use CornWatch only to monitor websites, services, systems, or
//           infrastructure that you own or are authorized to monitor.
//         </p>
//         <p>You must not use CornWatch to:</p>
//         <ul>
//           <li>Monitor systems without authorization.</li>
//           <li>Attempt to bypass security controls.</li>
//           <li>Perform unauthorized security testing.</li>
//           <li>Abuse monitoring endpoints or notification systems.</li>
//           <li>Use the Service for unlawful activities.</li>
//           <li>
//             Interfere with the operation of the Service or other users'
//             accounts.
//           </li>
//         </ul>
//         <h2>4. Subscriptions and Billing</h2>
//         <p>
//           CornWatch offers free and paid subscription plans. Paid subscriptions
//           are billed according to the pricing and billing period displayed at
//           checkout.
//         </p>
//         <p>
//           Payments for CornWatch subscriptions are processed by Paddle. Paddle
//           may act as the merchant of record and may process payments, taxes,
//           refunds, and related billing matters.
//         </p>
//         <h2>5. Subscription Cancellation</h2>
//         <p>
//           You may cancel your paid subscription through the available account or
//           billing management options. Unless otherwise stated at checkout,
//           cancellation prevents the subscription from renewing for the next
//           billing period.
//         </p>
//         <h2>6. Refunds</h2>
//         <p>
//           Refunds are handled according to our Refund Policy and applicable
//           Paddle billing procedures.
//         </p>
//         <h2>7. Service Availability</h2>
//         <p>
//           We aim to keep CornWatch available and reliable, but we do not
//           guarantee uninterrupted or error-free operation.
//         </p>
//         <p>
//           Monitoring results and alerts should not be considered a guarantee
//           that a website or service is continuously available.
//         </p>
//         <h2>8. Third-Party Services</h2>
//         <p>
//           CornWatch may integrate with third-party services such as Slack,
//           payment providers, hosting providers, email providers, and other
//           external services.
//         </p>
//         <h2>9. Intellectual Property</h2>
//         <p>
//           CornWatch and its software, branding, design, documentation, and
//           related materials are owned by or licensed to CornWatch and are
//           protected by applicable intellectual property laws.
//         </p>
//         <h2>10. Suspension and Termination</h2>
//         <p>
//           We may suspend or terminate an account if the account violates these
//           Terms, the Service is being used unlawfully, payment obligations are
//           not satisfied, or suspension is reasonably necessary to protect the
//           Service or other users.
//         </p>
//         <h2>11. Disclaimer</h2>
//         <p>
//           CornWatch provides monitoring information and alerts for informational
//           and operational purposes. We do not guarantee that every outage,
//           failure, or incident will be detected.
//         </p>
//         <h2>12. Limitation of Liability</h2>
//         <p>
//           To the maximum extent permitted by applicable law, CornWatch will not
//           be liable for indirect, incidental, special, consequential, or
//           loss-of-profit damages resulting from the use of or inability to use
//           the Service.
//         </p>
//         <h2>13. Changes to These Terms</h2>
//         <p>
//           We may update these Terms from time to time. When material changes are
//           made, we may provide notice through the Service or other appropriate
//           means.
//         </p>
//         <h2>14. Contact</h2>
//         <p>
//           If you have questions about these Terms, please contact us through the
//           contact information provided on the CornWatch website.
//         </p>
//       </div>
//     </main>
//   );
// }


import React from "react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-400">
            Legal
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: September 26, 2026
          </p>
        </div>

        {/* Content */}
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-10 lg:p-12">
          {/* Introduction */}
          <div className="space-y-5 text-[15px] leading-7 text-slate-400">
            <p>
              Welcome to <span className="font-medium text-white">CornWatch</span>.
              These Terms of Service ("Terms") govern your access to and use of
              the CornWatch website, application, and related services
              ("Service").
            </p>

            <p>
              By creating an account or using CornWatch, you agree to these
              Terms.
            </p>
          </div>

          <div className="my-10 h-px bg-slate-800" />

          {/* Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              1. The Service
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch is a cloud-based website and service reliability
              monitoring platform.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch allows users to add websites and online services that
              they own or are authorized to manage. The Service performs
              automated availability and health checks and can notify users
              when an issue is detected.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              2. Account Registration
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              You agree to:
            </p>

            <ul className="space-y-3 pl-5 text-[15px] leading-7 text-slate-400">
              <li className="list-disc pl-1">
                Provide accurate information when creating your account.
              </li>
              <li className="list-disc pl-1">
                Keep your account credentials secure.
              </li>
              <li className="list-disc pl-1">
                Not share your account credentials with unauthorized users.
              </li>
              <li className="list-disc pl-1">
                Notify us if you believe your account has been compromised.
              </li>
              <li className="list-disc pl-1">
                Be responsible for activity performed through your account.
              </li>
            </ul>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              3. Authorized Use
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              You may use CornWatch only to monitor websites, services,
              systems, or infrastructure that you own or are authorized to
              monitor.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              You must not use CornWatch to:
            </p>

            <ul className="space-y-3 pl-5 text-[15px] leading-7 text-slate-400">
              <li className="list-disc pl-1">
                Monitor systems without authorization.
              </li>
              <li className="list-disc pl-1">
                Attempt to bypass security controls.
              </li>
              <li className="list-disc pl-1">
                Perform unauthorized security testing.
              </li>
              <li className="list-disc pl-1">
                Abuse monitoring endpoints or notification systems.
              </li>
              <li className="list-disc pl-1">
                Use the Service for unlawful activities.
              </li>
              <li className="list-disc pl-1">
                Interfere with the operation of the Service or other users'
                accounts.
              </li>
            </ul>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              4. Subscriptions and Billing
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch offers free and paid subscription plans. Paid
              subscriptions are billed according to the pricing and billing
              period displayed at checkout.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              Payments for CornWatch subscriptions are processed by Paddle.
              Paddle may act as the merchant of record and may process
              payments, taxes, refunds, and related billing matters.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              5. Subscription Cancellation
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              You may cancel your paid subscription through the available
              account or billing management options. Unless otherwise stated
              at checkout, cancellation prevents the subscription from
              renewing for the next billing period.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              6. Refunds
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              Refunds are handled according to our Refund Policy and
              applicable Paddle billing procedures.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              7. Service Availability
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              We aim to keep CornWatch available and reliable, but we do not
              guarantee uninterrupted or error-free operation.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              Monitoring results and alerts should not be considered a
              guarantee that a website or service is continuously available.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              8. Third-Party Services
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch may integrate with third-party services such as Slack,
              payment providers, hosting providers, email providers, and other
              external services.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              9. Intellectual Property
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch and its software, branding, design, documentation, and
              related materials are owned by or licensed to CornWatch and are
              protected by applicable intellectual property laws.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              10. Suspension and Termination
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              We may suspend or terminate an account if the account violates
              these Terms, the Service is being used unlawfully, payment
              obligations are not satisfied, or suspension is reasonably
              necessary to protect the Service or other users.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              11. Disclaimer
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch provides monitoring information and alerts for
              informational and operational purposes. We do not guarantee that
              every outage, failure, or incident will be detected.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              12. Limitation of Liability
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              To the maximum extent permitted by applicable law, CornWatch
              will not be liable for indirect, incidental, special,
              consequential, or loss-of-profit damages resulting from the use
              of or inability to use the Service.
            </p>
          </section>

          {/* Section */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              13. Changes to These Terms
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              We may update these Terms from time to time. When material
              changes are made, we may provide notice through the Service or
              other appropriate means.
            </p>
          </section>

          {/* Contact */}
          <section className="mt-10 rounded-xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="text-xl font-semibold text-white">
              14. Contact
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              If you have questions about these Terms, please contact us
              through the contact information provided on the CornWatch
              website.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {/* Email */}
            <a
            href="mailto:ahmednazeel705@gmail.com"
            className="inline-flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
            <span>📧</span>
            support@cornwatch.mail
            </a>

            {/* WhatsApp */}
            <a
            href="https://wa.me/201009053248"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
            <span>💬</span>
            WhatsApp Support
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

