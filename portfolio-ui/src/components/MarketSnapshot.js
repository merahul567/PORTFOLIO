import React, { useState, useEffect, useRef } from "react";
import { axiosGet } from "../apiService";

export const snapshotInstruments = [
  { id: "nifty50", label: "Nifty 50", symbol: "CAPITALCOM:US100", customLabel: "NASDAQ 100" }, 
  { id: "bankNifty", label: "Bank Nifty", symbol: "BINANCE:BTCUSDT", customLabel: "Bitcoin" }, 
  { id: "gold", label: "Gold", symbol: "OANDA:XAUUSD", customLabel: "Gold (Spot)" },
];

// Reusable script loader wrapper abstraction
const useTradingViewLoader = (callback) => {
  useEffect(() => {
    if (window.TradingView) {
      callback();
      return;
    }
    let script = document.getElementById("tradingview-js-sdk");
    if (!script) {
      script = document.createElement("script");
      script.id = "tradingview-js-sdk";
      script.src = "https://tradingview.com"; /* ⚡ FIXED: Points to correct runtime SDK engine asset file */
      script.type = "text/javascript";
      script.async = true;
      document.head.appendChild(script);
    }
    const existingOnload = script.onload;
    script.onload = () => {
      if (existingOnload) existingOnload();
      callback();
    };
  }, [callback]);
};

export default function MarketSnapshot() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tickerRef = useRef(null);

  // 1. Unified Background Sync Worker matching your updated Java payload responses
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

  // 2. Abstracted widget instantiation lifecycle
  useTradingViewLoader(
    React.useCallback(() => {
      if (!tickerRef.current || !window.TradingView) return;
      tickerRef.current.innerHTML = "";

      const targetId = "tradingview-snapshot-ticker-inner";
      const innerDiv = document.createElement("div");
      innerDiv.id = targetId;
      innerDiv.style.width = "100%";
      innerDiv.style.height = "100%";
      tickerRef.current.appendChild(innerDiv);

      const activeSymbols = snapshotInstruments.map(item => [item.customLabel, item.symbol]);

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
    }, [])
  );

  // Safe formatting parsing worker abstraction handles deep object validation natively
  const formatRate = (obj) => {
    if (!obj || obj.currentPrice === null || obj.currentPrice === undefined) return "—";
    return Number(obj.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return React.createElement(
    "div",
    { className: "market-summary-shell" },
    
    // 💸 Expanded Left Card: Multi-currency list matching Java endpoints
    React.createElement(
      "div",
      { className: "market-summary-card market-summary-rate", style: { padding: "1.1rem" } },
      React.createElement("div", { className: "summary-heading" }, "FOREX RATES (INR)"),
      
      React.createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "1rem" } },
        
        // Dynamic Currency Component Row 1: USD
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px dashed var(--line)", paddingBottom: "4px" } },
          React.createElement("span", { style: { fontSize: "0.85rem", fontWeight: "600", color: "var(--ink)" } }, "USD / INR"),
          React.createElement("span", { style: { fontSize: "1.1rem", fontFamily: "var(--font-mono)", fontWeight: "700" } }, "₹" + formatRate(marketData?.usdInr))
        ),
        // Dynamic Currency Component Row 2: EUR
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px dashed var(--line)", paddingBottom: "4px" } },
          React.createElement("span", { style: { fontSize: "0.85rem", fontWeight: "600", color: "var(--ink)" } }, "EUR / INR"),
          React.createElement("span", { style: { fontSize: "1.1rem", fontFamily: "var(--font-mono)", fontWeight: "700" } }, "₹" + formatRate(marketData?.eurInr))
        ),
        // Dynamic Currency Component Row 3: GBP
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
          React.createElement("span", { style: { fontSize: "0.85rem", fontWeight: "600", color: "var(--ink)" } }, "GBP / INR"),
          React.createElement("span", { style: { fontSize: "1.1rem", fontFamily: "var(--font-mono)", fontWeight: "700" } }, "₹" + formatRate(marketData?.gbpInr))
        )
      ),
      
      React.createElement("div", { className: "summary-subtitle", style: { marginTop: "1rem" } }, error ? error : loading ? "Updating..." : "ExchangeRate-API Reference")
    ),

    // Right Card Component: TradingView Active Interactive Embed Sandbox Node
    React.createElement(
      "div",
      { className: "market-summary-card market-summary-ticker" },
      React.createElement("div", { className: "ticker-header" }, "MARKET SNAPSHOT"),
      
      // Fixed outer CSS selector class hooks apply clean headroom height properties
      React.createElement("div", {
        className: "tradingview-snapshot-canvas-wrapper",
        ref: tickerRef
      })
    )
  );
}