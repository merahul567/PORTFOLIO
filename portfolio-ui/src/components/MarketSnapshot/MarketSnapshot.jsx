import React, { useEffect, useRef, useState } from "react";
import { formatMarketRate, getMarketSnapshot } from "../../services/marketService";
import "./MarketSnapshot.css";

export const snapshotInstruments = [
  { id: "nasdaq100", label: "NASDAQ 100", symbol: "CAPITALCOM:US100", customLabel: "NASDAQ 100" },
  { id: "bitcoin", label: "Bitcoin", symbol: "BINANCE:BTCUSDT", customLabel: "Bitcoin" },
  { id: "gold", label: "Gold", symbol: "OANDA:XAUUSD", customLabel: "Gold" },
];

export default function MarketSnapshot() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    async function fetchMarketSnapshot() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMarketSnapshot();
        setMarketData(data || null);
      } catch {
        setError("Feed unavailable");
      } finally {
        setLoading(false);
      }
    }

    fetchMarketSnapshot();
    const interval = setInterval(fetchMarketSnapshot, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    let cancelled = false;
    let retryTimer;
    const targetId = "tradingview-snapshot-ticker-inner";

    function init() {
      if (cancelled) return;
      if (!window.TradingView) {
        retryTimer = setTimeout(init, 250);
        return;
      }

      ticker.innerHTML = "";
      const innerDiv = document.createElement("div");
      innerDiv.id = targetId;
      innerDiv.style.width = "100%";
      innerDiv.style.height = "100%";
      ticker.appendChild(innerDiv);

      new window.TradingView.MediumWidget({
        container_id: targetId,
        symbols: snapshotInstruments.map(({ customLabel, symbol }) => [customLabel, symbol]),
        width: "100%",
        height: "100%",
        locale: "en",
        colorTheme: "light",
        gridLineColor: "#f0f3f6",
        trendLineColor: "#2bf",
        fontColor: "#787b86",
        underLineColor: "#e0f0ff",
        chartOnly: false,
      });
    }

    init();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      ticker.innerHTML = "";
    };
  }, []);

  const rates = [
    ["USD / INR", marketData?.usdInr?.currentPrice],
    ["EUR / INR", marketData?.eurInr?.currentPrice],
    ["GBP / INR", marketData?.gbpInr?.currentPrice],
  ];

  return (
    <div className="market-summary-shell">
      <div className="market-summary-card market-summary-rate">
        <div className="summary-heading">FOREX RATES (INR)</div>
        <dl className="snapshot-rates">
          {rates.map(([label, value]) => (
            <div className="snapshot-rate-row" key={label}>
              <dt>{label}</dt>
              <dd>₹{formatMarketRate(value)}</dd>
            </div>
          ))}
        </dl>
        <div className="summary-subtitle">
          {error || (loading ? "Updating..." : "ExchangeRate-API Reference")}
        </div>
      </div>

      <div className="market-summary-card market-summary-ticker">
        <div className="ticker-header">MARKET TRENDS</div>
        <div className="tradingview-snapshot-canvas-wrapper" ref={tickerRef} />
      </div>
    </div>
  );
}