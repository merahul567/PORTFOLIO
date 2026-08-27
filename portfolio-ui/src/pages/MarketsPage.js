import React from "react";
import Seo from "../seo/Seo";
import MarketDashboard from "../components/MarketDashboard";

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
          Real-time data for Indian indices, global benchmarks, precious metals, and forex rates.
          All data sourced from free public APIs — no paid subscriptions.
        </p>
        
        <MarketDashboard />
      </div>
    </div>
  );
}
