import React from "react";
import Seo from "../../seo/Seo";

export default function DisclaimerPage() {
  return (
    <div className="page inner-page">
      <Seo
        title="Disclaimer"
        description="Disclaimer for KumarRahul.in. Information on this site is for educational and informational purposes only and is not investment advice."
        path="/disclaimer"
      />
      <div className="wrap">
        <p className="page-kicker">Legal</p>
        <h1 className="page-title">Disclaimer</h1>
        <p className="page-lead">
          The information on KumarRahul.in is for informational, educational, and research purposes only.
        </p>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>Not investment advice</h2>
          <p>
            Nothing on this website should be considered financial advice, investment advice, or a recommendation to buy
            or sell any security, ETF, stock, or fund.
          </p>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>Market data can be delayed or incomplete</h2>
          <p>
            Public market data, exchange references, and third-party feeds are often delayed, approximate, or subject to
            provider limitations. Figures may differ from official issuer or exchange values.
          </p>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>Independent research only</h2>
          <p>
            Tools and content on this site are created for independent study and research. Users should perform their own
            diligence and consult a qualified financial professional before acting on any information.
          </p>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <h2>Risk warning</h2>
          <p>
            Investing carries risk, including the possibility of loss of capital. No tool or article on this site can reduce
            the inherent risks of market participation.
          </p>
        </section>
      </div>
    </div>
  );
}
