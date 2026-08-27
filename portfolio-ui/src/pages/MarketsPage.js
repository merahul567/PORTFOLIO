import React from "react";
import Seo from "../seo/Seo";

export default function MarketsPage() {
  return (
    <div className="page inner-page">
      <Seo
        title="Markets"
        description="Indian and global market dashboard on KumarRahul.in. Live values appear only when a data source is configured."
        path="/markets"
      />
      <div className="wrap">
        <p className="page-kicker">Market intelligence</p>
        <h1 className="page-title">Market dashboard</h1>
        <p className="page-lead">
          Indian indices, global benchmarks, metals, and USD/INR will sit here with last
          price, daily change, timestamp, and source. The layout is ready. A live feed is not
          connected yet, so no numbers are shown.
        </p>
        <div className="card-list">
          <div className="catalog-item">
            <h2>Indian markets</h2>
            <p>Nifty 50, Sensex, Bank Nifty, and major sector indices.</p>
          </div>
          <div className="catalog-item">
            <h2>Global</h2>
            <p>NASDAQ, S&amp;P 500, Dow Jones.</p>
          </div>
          <div className="catalog-item">
            <h2>Commodities &amp; currency</h2>
            <p>Gold, silver, and USD/INR.</p>
          </div>
        </div>
        <p className="quiet-note" style={{ marginTop: "1.2rem" }}>
          Data is for informational purposes only. Quotes will be cached on the server so
          visitors do not each trigger an external API call.
        </p>
      </div>
    </div>
  );
}
