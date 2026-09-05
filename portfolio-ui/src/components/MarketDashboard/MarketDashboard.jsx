import React, { useEffect, useRef, useState } from "react";
import { formatMarketRate, getMarketSnapshot } from "../../services/marketService";
import "./MarketDashboard.css";

const widgetConfigs = [
  { id: "tradingview-nasdaq", title: "NASDAQ 100 Index", symbol: "CAPITALCOM:US100", description: "US Tech Benchmark (USD)" },
  { id: "tradingview-bitcoin", title: "Bitcoin", symbol: "BINANCE:BTCUSDT", description: "Crypto Token (USD)" },
  { id: "tradingview-gold-global", title: "Gold", symbol: "OANDA:XAUUSD", description: "Global Spot Gold (USD)" },
];

function DashboardChartCard({ id, title, symbol, description }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let retryTimer;
    const targetId = `${id}-container-dashboard`;

    function init() {
      if (cancelled) return;
      if (!window.TradingView) {
        retryTimer = setTimeout(init, 250);
        return;
      }

      container.innerHTML = "";
      const innerDiv = document.createElement("div");
      innerDiv.id = targetId;
      innerDiv.style.width = "100%";
      innerDiv.style.height = "100%";
      container.appendChild(innerDiv);

      new window.TradingView.widget({
        container_id: targetId,
        symbol,
        width: "100%",
        height: "100%",
        interval: "D",
        timezone: "Asia/Kolkata",
        theme: "light",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: false,
        hide_legend: true,
        hide_volume: true,
        withdateranges: true,
      });
    }

    init();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      container.innerHTML = "";
    };
  }, [id, symbol]);

  return (
    <div className="tradingview-widget-card">
      <div className="widget-card-header">
        <h3>{title}</h3>
        <span>{description}</span>
      </div>
      <div className="tradingview-widget" ref={containerRef} />
    </div>
  );
}

export default function MarketDashboard() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMarketSnapshot() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMarketSnapshot();
        setMarketData(data || null);
      } catch (err) {
        console.error("Failed to fetch dashboard forex data:", err);
        setError("Unable to load references. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchMarketSnapshot();
  }, []);

  const rates = [
    ["USD / INR", marketData?.usdInr?.currentPrice],
    ["EUR / INR", marketData?.eurInr?.currentPrice],
    ["GBP / INR", marketData?.gbpInr?.currentPrice],
  ];

  return (
    <div className="market-dashboard">
      <div className="market-rate-panel">
        <div className="rate-header">
          <div>
            <span className="rate-label">LIVE REFERENCE RATES</span>
            <h3>ExchangeRate-API Reference Indexes</h3>
          </div>
          <span className="rate-source">{loading ? "Syncing..." : "Live feed active"}</span>
        </div>
        {error ? (
          <p className="rate-error">{error}</p>
        ) : (
          <div className="dashboard-rate-row-grid">
            {rates.map(([label, value]) => (
              <div className="dashboard-rate-item" key={label}>
                <span className="dashboard-rate-label">{label}</span>
                <div className="rate-value">₹{formatMarketRate(value)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="market-widget-grid">
        {widgetConfigs.map((config) => <DashboardChartCard key={config.id} {...config} />)}
      </div>
      <div className="dashboard-footer">
        <p className="note">Charts generated natively via TradingView Client Web Framework interfaces.</p>
      </div>
    </div>
  );
}