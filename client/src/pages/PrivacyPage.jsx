
import React from "react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-400">
            Legal
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Privacy Policy
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
              This Privacy Policy explains how{" "}
              <span className="font-medium text-white">CornWatch</span>{" "}
              collects, uses, and protects information when you use our
              website and services.
            </p>
          </div>

          <div className="my-10 h-px bg-slate-800" />

          {/* 1 */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-white">
              1. Information We Collect
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="mb-2 text-base font-medium text-slate-200">
                  Account Information
                </h3>

                <p className="text-[15px] leading-7 text-slate-400">
                  When you create an account, we may collect information such
                  as your name, email address, authentication information, and
                  account preferences.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium text-slate-200">
                  Monitoring Configuration
                </h3>

                <p className="text-[15px] leading-7 text-slate-400">
                  When you use CornWatch, you may provide information about
                  websites or services that you want to monitor, including
                  website URLs, service names, monitoring settings, alert
                  configuration, notification destinations, and monitoring
                  history.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium text-slate-200">
                  Billing Information
                </h3>

                <p className="text-[15px] leading-7 text-slate-400">
                  Paid subscription payments are processed by Paddle. CornWatch
                  does not need to store your complete payment card details.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium text-slate-200">
                  Technical Information
                </h3>

                <p className="text-[15px] leading-7 text-slate-400">
                  We may automatically receive technical information such as IP
                  address, browser type, device information, operating system,
                  request information, timestamps, and error or diagnostic
                  information.
                </p>
              </div>
            </div>
          </section>

          {/* 2 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              2. How We Use Information
            </h2>

            <ul className="space-y-3 pl-5 text-[15px] leading-7 text-slate-400">
              {[
                "Create and manage accounts.",
                "Provide CornWatch services.",
                "Perform website and service checks.",
                "Send monitoring alerts.",
                "Maintain monitoring history and logs.",
                "Process subscriptions and billing through our payment provider.",
                "Provide customer support.",
                "Maintain security.",
                "Detect abuse and unauthorized activity.",
                "Improve the reliability and functionality of CornWatch.",
                "Comply with legal obligations.",
              ].map((item) => (
                <li key={item} className="list-disc pl-1">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              3. Monitoring Data
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch performs automated requests to the websites and
              services configured by users.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              Users are responsible for ensuring that they have appropriate
              authorization to monitor the websites and services they add to
              CornWatch.
            </p>
          </section>

          {/* 4 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              4. Third-Party Services
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch may use third-party providers to operate parts of the
              Service, including Paddle, hosting providers, email providers,
              Slack, authentication providers, and analytics or logging
              providers where applicable.
            </p>
          </section>

          {/* 5 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              5. Cookies
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch may use cookies or similar technologies necessary to
              authenticate users, maintain sessions, remember preferences, and
              operate the website.
            </p>
          </section>

          {/* 6 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              6. Data Retention
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              We retain account and service information for as long as
              reasonably necessary to provide the Service, maintain security,
              comply with legal obligations, resolve disputes, and enforce our
              agreements.
            </p>

            <p className="text-[15px] leading-7 text-slate-400">
              Monitoring log retention may depend on the user's subscription
              plan.
            </p>
          </section>

          {/* 7 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              7. Data Security
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              We use reasonable technical and organizational measures designed
              to protect information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </section>

          {/* 8 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              8. Your Rights
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              Depending on your location and applicable law, you may have
              rights regarding your personal information, including access,
              correction, deletion, restriction, objection, and data
              portability.
            </p>
          </section>

          {/* 9 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              9. International Data Processing
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch may use service providers located in countries other
              than your country of residence. Where required, appropriate
              safeguards will be used for international transfers of personal
              information.
            </p>
          </section>

          {/* 10 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              10. Children's Privacy
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              CornWatch is not intended for children under the applicable
              minimum age for providing consent to online services in their
              jurisdiction.
            </p>
          </section>

          {/* 11 */}
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              11. Changes to This Privacy Policy
            </h2>

            <p className="text-[15px] leading-7 text-slate-400">
              We may update this Privacy Policy from time to time. If material
              changes are made, we may provide appropriate notice.
            </p>
          </section>

          {/* 12 - Contact */}
          <section className="mt-10 rounded-xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="text-xl font-semibold text-white">
              12. Contact
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              If you have questions or requests regarding this Privacy Policy,
              please contact us using one of the support options below.
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
                href="https://wa.me/201234567890?text=Hello%20CornWatch%20Support%2C%20I%20have%20a%20privacy%20question."
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
