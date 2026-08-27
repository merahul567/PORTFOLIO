import React, { useState, useEffect } from "react";
import { axiosGet } from "../apiService";

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
        setMarketData(data);
      } catch (err) {
        console.error("Failed to fetch market data:", err);
        setError("Failed to load market data");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 300000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "—";
    return price.toFixed(2);
  };

  const formatChange = (change, changePercent) => {
    if (change === null || change === undefined) return "—";
    const sign = change >= 0 ? "+" : "";
    return `${sign}${formatPrice(change)} (${sign}${changePercent?.toFixed(2) || "0.00"}%)`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !marketData) {
    return (
      <div className="snapshot-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <article key={i} className="snapshot-card">
            <div className="snapshot-region">Loading...</div>
            <h3>—</h3>
            <div className="snapshot-value">—</div>
            <div className="snapshot-meta">Loading data...</div>
          </article>
        ))}
      </div>
    );
  }

  if (error && !marketData) {
    return (
      <div className="snapshot-grid">
        <div style={{ gridColumn: "1 / -1", padding: "1rem", color: "var(--muted)" }}>
          {error}
        </div>
      </div>
    );
  }

  const instruments = [
    { key: "gold", label: "Gold", region: "COMMODITIES", source: "Metals API" },
    { key: "nifty50", label: "Nifty 50", region: "INDIA", source: "Yahoo Finance" },
    { key: "sensex", label: "Sensex", region: "INDIA", source: "Yahoo Finance" },
    { key: "nasdaq", label: "NASDAQ", region: "GLOBAL", source: "Yahoo Finance" },
    { key: "usdInr", label: "USD / INR", region: "CURRENCY", source: "ExchangeRate API" },
  ];

  return (
    <div className="snapshot-grid">
      {instruments.map((inst) => {
        const data = marketData?.[inst.key];
        const isAvailable = data?.status === "Available";

        return (
          <article key={inst.key} className="snapshot-card">
            <div className="snapshot-region">{inst.region}</div>
            <h3>{inst.label}</h3>
            <div className="snapshot-value">
              {isAvailable ? `${formatPrice(data.currentPrice)}` : "Unavailable"}
            </div>
            <div className="snapshot-meta">
              {isAvailable ? (
                <>
                  {formatChange(data.change, data.changePercent)}
                  <br />
                  {formatTimestamp(data.timestamp)} · {inst.source}
                </>
              ) : (
                "No live feed configured"
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
