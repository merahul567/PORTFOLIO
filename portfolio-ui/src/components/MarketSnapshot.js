import React, { useState, useEffect } from "react";
import { axiosGet } from "../apiService";

const instruments = [
  { key: "gold", label: "Gold" },
  { key: "nifty50", label: "Nifty 50" },
  { key: "bankNifty", label: "Bank Nifty" },
  { key: "sensex", label: "Sensex" },
];

const formatValue = (value) => {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatSigned = (value) => {
  if (value === null || value === undefined) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatValue(value)}`;
};

export default function MarketSnapshot() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await axiosGet("market/snapshot");
        setMarketData(data || null);
      } catch (err) {
        console.error("Failed to fetch market data:", err);
        setError("Exchange rate feed is temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 300000);
    return () => clearInterval(interval);
  }, []);

  const usdQuote = marketData?.usdInr;
  const usdRate = usdQuote?.status === "Available" ? formatValue(usdQuote.currentPrice) : "—";

  const rows = instruments.map((item) => {
    const data = marketData?.[item.key];
    const hasData = data?.status === "Available";
    const price = hasData ? formatValue(data.currentPrice) : "—";
    const change = hasData && data.change !== null && data.change !== undefined
      ? `${formatSigned(data.change)} (${formatSigned(data.changePercent)}%)`
      : "—";

    let trend = "neutral";
    if (hasData && data.changePercent !== null && data.changePercent !== undefined) {
      trend = Number(data.changePercent) >= 0 ? "up" : "down";
    }

    return { ...item, price, change, trend };
  });

  return (
    <div className="market-summary-shell">
      <div className="market-summary-card market-summary-rate">
        <div className="summary-heading">USD / INR</div>
        <div className="summary-rate">₹{usdRate}</div>
        <div className="summary-subtitle">
          {error ? "Feed unavailable" : loading ? "Updating..." : "ExchangeRate-API"}
        </div>
      </div>

      <div className="market-summary-card market-summary-ticker">
        <div className="ticker-header">MARKET SNAPSHOT</div>
        <div className="ticker-grid">
          {rows.map((row) => (
            <div key={row.key} className="ticker-row">
              <span className="ticker-name">{row.label}</span>
              <span className="ticker-value">{row.price}</span>
              <span className={`ticker-change ${row.trend}`}>
                {row.change}
              </span>
            </div>
          ))}
        </div>
        <div className="ticker-footer">Powered by TradingView</div>
      </div>
    </div>
  );
}
