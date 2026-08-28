import React, { useEffect, useState } from "react";
import { axiosGet } from "../apiService";

const widgetConfigs = [
  { id: "tradingview-nifty", title: "Nifty 50", symbol: "NSE:NIFTY", description: "India" },
  { id: "tradingview-bank-nifty", title: "Bank Nifty", symbol: "NSE:BANKNIFTY", description: "India" },
  { id: "tradingview-sensex", title: "Sensex", symbol: "INDEXBOM:SENSEX", description: "India" },
  { id: "tradingview-gold", title: "Gold", symbol: "MCX:GOLD1!", description: "MCX (INR)" },
];

const buildTradingViewUrl = (symbol) => {
  const params = new URLSearchParams({
    frameElementId: symbol.replace(/[\s:!]/g, "") + "-tv",
    symbol,
    interval: "D",
    timezone: "Etc/UTC",
    theme: "light",
    style: "1",
    locale: "en",
    toolbarbg: "#f1f3f6",
    enable_publishing: "false",
    allow_symbol_change: "false",
    details: "false",
    hide_volume: "true",
    hide_legend: "true",
    saveimage: "false",
    withdateranges: "true",
  });

  return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
};

export default function MarketDashboard() {
  const [usdInr, setUsdInr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsdInr = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await axiosGet("market/snapshot");
        setUsdInr(data?.usdInr || null);
      } catch (err) {
        console.error("Failed to fetch USD/INR rate:", err);
        setError("Unable to load the ExchangeRate-API rate. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsdInr();
  }, []);

  const rateText = usdInr && usdInr.currentPrice !== null && usdInr.currentPrice !== undefined
    ? Number(usdInr.currentPrice).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";

  return (
    <div className="market-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-status">{loading ? "Updating..." : "Live feed"}</p>
          <p className="dashboard-timestamp">
            {usdInr?.timestamp ? `Last updated: ${new Date(usdInr.timestamp).toLocaleString()}` : "ExchangeRate-API feed loading"}
          </p>
        </div>
      </div>

      <div className="market-rate-panel">
        <div className="rate-header">
          <div>
            <span className="rate-label">USD / INR</span>
            <h3>ExchangeRate-API reference rate</h3>
          </div>
          <span className="rate-source">ExchangeRate-API</span>
        </div>

        {error ? (
          <p className="rate-error">{error}</p>
        ) : (
          <>
            <div className="rate-value">₹{rateText}</div>
            <p className="rate-note">
              Market rate is sourced from ExchangeRate-API and shown with required attribution for public website use.
            </p>
          </>
        )}
      </div>

      <div className="market-widget-grid">
        {widgetConfigs.map(({ id, title, description, symbol }) => (
          <div key={id} className="tradingview-widget-card">
            <div className="widget-card-header">
              <h3>{title}</h3>
              <span>{description}</span>
            </div>
            <div className="tradingview-widget">
              <iframe
                title={title}
                src={buildTradingViewUrl(symbol)}
                frameBorder="0"
                scrolling="no"
                allowTransparency="true"
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-footer">
        <p className="note">
          <strong>Attribution:</strong> TradingView widgets are shown under TradingView attribution. The USD / INR rate is sourced from ExchangeRate-API.
        </p>
        <p className="note quiet">
          <strong>Disclaimer:</strong> Market charts and reference rates are informational only and are not investment advice.
        </p>
      </div>
    </div>
  );
}
