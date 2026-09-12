import React from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "../../seo/Seo";
import { getToolBySlug } from "../../data/toolsCatalog";
import EtfPremiumScanner from "../../components/EtfPremiumScanner/EtfPremiumScanner";

export default function ToolDetailPage() {
  const { slug } = useParams();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="page">
        <Seo title="Tool not found" description="That tool is not in the KumarRahul.in catalogue." path={`/tools/${slug || ""}`} />
        <div className="wrap">
          <h1 className="page-title">Tool not found</h1>
          <p className="page-lead">
            That utility is not in the catalogue. <Link to="/tools">Back to tools</Link>
          </p>
        </div>
      </div>
    );
  }

  if (slug === "etf-premium") {
    return (
      <div className="page inner-page">
        <Seo
          title="ETF Premium Discount Scanner India | NAV vs Market Price"
          description="Track ETF premium and discount with a free NAV-versus-market-price scanner. Compare US and Indian ETF pricing to spot premium or discount opportunities."
          path={tool.route}
        />
        <div className="wrap">
          <p className="page-kicker">{tool.category}</p>
          <h1 className="page-title">ETF Premium / Discount Scanner</h1>
          <p className="page-lead">Compare ETF market price against NAV and identify whether it is trading at a premium or discount.</p>

          <div style={{ marginTop: "1.2rem", lineHeight: 1.7 }}>
            <p>
              An ETF premium or discount happens when the traded market price differs from its net asset value (NAV).
              A premium means the ETF is trading above NAV, while a discount means it is trading below NAV.
            </p>
            <p>
              For Indian investors tracking US-listed or international ETF exposure, this gap can matter because it changes the effective cost of entry.
              The calculation is straightforward: premium% = ((market price - NAV) / NAV) × 100.
            </p>
            <p>
              This page is meant for educational analysis and tracking, not investment advice. Always verify the latest issuer NAV, fund structure, and market data before making a decision.
            </p>
          </div>

          <EtfPremiumScanner />

          <section style={{ marginTop: "2rem" }}>
            <h2>Frequently asked questions</h2>
            <div style={{ marginTop: "1rem" }}>
              <h3>What is ETF premium and discount?</h3>
              <p>Premium means the ETF trades above NAV. Discount means it trades below NAV.</p>

              <h3>Why does it matter?</h3>
              <p>It can change the effective price paid relative to underlying assets, which matters when comparing similar funds.</p>

              <h3>Is this the same as an arbitrage signal?</h3>
              <p>No. The metric is useful for screening, but it is not a recommendation or a trade trigger by itself.</p>
            </div>
          </section>

          <p style={{ marginTop: "1.4rem" }}>
            <Link to="/tools">All tools</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page inner-page">
      <Seo title={tool.name} description={tool.description} path={tool.route} />
      <div className="wrap">
        <p className="page-kicker">{tool.category}</p>
        <h1 className="page-title">{tool.name}</h1>
        <p className="page-lead">{tool.description}</p>
        <p className="quiet-note" style={{ marginTop: "1.2rem" }}>
          This tool is {tool.status === "planned" ? "planned" : "in development"}. The
          interface and calculations will ship here without investment advice, buy/sell
          language, or fabricated market data.
        </p>
        <p style={{ marginTop: "1.4rem" }}>
          <Link to="/tools">All tools</Link>
        </p>
      </div>
    </div>
  );
}