import React from "react";
import Seo from "../../seo/Seo";

export default function PrivacyPage() {
  return (
    <div className="page inner-page">
      <Seo
        title="Privacy Policy"
        description="Privacy policy for KumarRahul.in. Learn how information is handled on this site and what is collected for analytics and contact purposes."
        path="/privacy"
      />
      <div className="wrap">
        <p className="page-kicker">Legal</p>
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-lead">
          This page explains how this website handles information and what visitors should expect while using KumarRahul.in.
        </p>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>1. Information we may collect</h2>
          <p>
            This site may use standard analytics tools, browser logs, and server logs to understand traffic patterns,
            page performance, and basic usage information. This may include browser type, device details, page paths,
            and referring websites.
          </p>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>2. Contact information</h2>
          <p>
            If you contact the site owner by email or through social channels, the information you provide will be used
            only to respond to your message and maintain communication related to the site.
          </p>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>3. Cookies and analytics</h2>
          <p>
            Analytics may use cookies or similar client-side identifiers to measure site traffic and improve usability.
            You can disable cookies in your browser settings, but some functionality may be reduced.
          </p>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>4. Third-party services</h2>
          <p>
            This website may use third-party services for analytics, market data, or embedded widgets. Those providers may
            process data according to their own privacy policies.
          </p>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>5. No personal data sales</h2>
          <p>
            KumarRahul.in does not sell personal information to third parties for marketing or advertising purposes.
          </p>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>6. Changes</h2>
          <p>
            This policy may be updated from time to time. Continued use of the site after an update means you accept the
            updated policy.
          </p>
        </section>
      </div>
    </div>
  );
}
