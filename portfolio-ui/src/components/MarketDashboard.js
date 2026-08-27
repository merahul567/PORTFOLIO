import React, { useState, useEffect } from "react";
import { axiosGet } from "../apiService";

export default function MarketDashboard() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await axiosGet("market/snapshot");
        setMarketData(data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Failed to fetch market data:", err);
        setError("Unable to load market data. Please try again later.");
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
    return typeof price === "number"
      ? price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : price;
  };

  const formatChange = (change) => {
    if (change === null || change === undefined) return "—";
    const sign = change >= 0 ? "+" : "";
    return `${sign}${formatPrice(change)}`;
  };

  const getChangeClass = (change) => {
    if (change === null || change === undefined) return "";
    return change >= 0 ? "positive" : "negative";
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) {
      return timestamp;
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "—";
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return lastUpdated.toLocaleDateString();
  };

  const marketSections = [
    {
      title: "Indian Markets",
      description: "Major indices for Indian equity markets",
      instruments: ["nifty50", "sensex"],
    },
    {
      title: "Global Markets",
      description: "International stock market indices",
      instruments: ["nasdaq"],
    },
    {
      title: "Commodities & Currency",
      description: "Precious metals and forex rates",
      instruments: ["gold", "usdInr"],
    },
  ];

  const instrumentLabels = {
    gold: { name: "Gold", symbol: "XAU/USD" },
    nifty50: { name: "Nifty 50", symbol: "^NSEI" },
    sensex: { name: "Sensex", symbol: "^BSESN" },
    nasdaq: { name: "NASDAQ", symbol: "^IXIC" },
    usdInr: { name: "USD / INR", symbol: "USD/INR" },
  };

  if (error && !marketData) {
    return (
      <div className="market-error" style={{ marginTop: "2rem" }}>
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
          <p>{error}</p>
          <p style={{ fontSize: "0.85rem", marginTop: "1rem" }}>
            The market data service may be temporarily unavailable. Please refresh to retry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="market-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-status">
            {loading ? "Updating..." : "Data live"}
          </p>
          <p className="dashboard-timestamp">
            Last updated: {formatLastUpdated()}
          </p>
        </div>
      </div>

      {marketSections.map((section) => (
        <section key={section.title} className="market-section">
          <div className="section-header">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </div>

          <div className="market-cards-grid">
            {section.instruments.map((instKey) => {
              const data = marketData?.[instKey];
              const label = instrumentLabels[instKey];
              const isAvailable = data?.status === "Available";

              return (
                <div key={instKey} className="market-card">
                  <div className="card-header">
                    <h3>{label.name}</h3>
                    <span className="card-symbol">{label.symbol}</span>
                  </div>

                  {isAvailable ? (
                    <div className="card-content">
                      <div className="price-section">
                        <div className="price">{formatPrice(data.currentPrice)}</div>
                        <div className={`change ${getChangeClass(data.change)}`}>
                          <span className="change-value">
                            {formatChange(data.change)}
                          </span>
                          <span className="change-percent">
                            ({data.changePercent >= 0 ? "+" : ""}
                            {formatPrice(data.changePercent)}%)
                          </span>
                        </div>
                      </div>

                      <div className="card-meta">
                        <div className="meta-row">
                          <span className="meta-label">Source</span>
                          <span className="meta-value">{data.source}</span>
                        </div>
                        <div className="meta-row">
                          <span className="meta-label">Updated</span>
                          <span className="meta-value">{formatTimestamp(data.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card-unavailable">
                      <p className="unavailable-text">Unavailable</p>
                      <p className="unavailable-reason">No live feed configured</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="dashboard-footer">
        <p className="note">
          <strong>Data source:</strong> All market data is sourced from free public APIs
          (Yahoo Finance, ExchangeRate API, Metals API). Data is cached server-side to minimize
          external API calls.
        </p>
        <p className="note quiet">
          <strong>Disclaimer:</strong> Market data is for informational purposes only. Not
          intended for trading decisions. Prices may have a 15-30 minute delay depending on the
          data source.
        </p>
      </div>
    </div>
  );
}
