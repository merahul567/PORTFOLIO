import React from "react";
import Seo from "../../seo/Seo";
import MarketDashboard from "../../components/MarketDashboard/MarketDashboard";

export default function MarketsPage() {
  return (
    <div className="page inner-page">
      <Seo
        title="Markets"
        description="Market charts and currency rates displayed with TradingView and ExchangeRate-API attribution on KumarRahul.in."
        path="/markets"
      />
      <div className="wrap">
        <p className="page-kicker">Market intelligence</p>
        <h1 className="page-title">Market dashboard</h1>
        <p className="page-lead">
          TradingView widgets display the market charts, while the Exchange reference rate is sourced from ExchangeRate-API under the provider attribution requirements for public website use.
        </p>
        <MarketDashboard />
      </div>
    </div>
  );
}