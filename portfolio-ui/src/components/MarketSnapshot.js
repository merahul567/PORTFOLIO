import React, { useState, useEffect, useRef } from "react";
import { axiosGet } from "../apiService";
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
    const fetchMarketSnapshot = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await axiosGet("market/snapshot");
        setMarketData(data || null);
      } catch (err) {
        setError("Feed unavailable");
      } finally {
        setLoading(false);
      }
    };
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

    const init = () => {
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

      const activeSymbols = snapshotInstruments.map(item => [item.customLabel, item.symbol]);

      // Use MediumWidget provided by TradingView SDK
      new window.TradingView.MediumWidget({
        container_id: targetId,
        symbols: activeSymbols,
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
    };

    init();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      ticker.innerHTML = "";
    };
  }, []); 

  const formatRate = (obj) => {
    if (!obj || obj.currentPrice === null || obj.currentPrice === undefined) return "—";
    return Number(obj.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return React.createElement(
    "div",
    { className: "market-summary-shell" },
    
    React.createElement(
      "div",
      { className: "market-summary-card market-summary-rate" },
      React.createElement("div", { className: "summary-heading" }, "FOREX RATES (INR)"),
      
      React.createElement(
        "dl",
        { className: "snapshot-rates" },
        
        React.createElement("div", { className: "snapshot-rate-row" },
          React.createElement("dt", null, "USD / INR"),
          React.createElement("dd", null, "₹" + formatRate(marketData?.usdInr))
        ),
        React.createElement("div", { className: "snapshot-rate-row" },
          React.createElement("dt", null, "EUR / INR"),
          React.createElement("dd", null, "₹" + formatRate(marketData?.eurInr))
        ),
        React.createElement("div", { className: "snapshot-rate-row" },
          React.createElement("dt", null, "GBP / INR"),
          React.createElement("dd", null, "₹" + formatRate(marketData?.gbpInr))
        )
      ),
      
      React.createElement("div", { className: "summary-subtitle" }, error ? error : loading ? "Updating..." : "ExchangeRate-API Reference")
    ),

    React.createElement(
      "div",
      { className: "market-summary-card market-summary-ticker" },
      React.createElement("div", { className: "ticker-header" }, "MARKET TRENDS"),
      React.createElement("div", {
        className: "tradingview-snapshot-canvas-wrapper",
        ref: tickerRef
      })
    )
  );
}
