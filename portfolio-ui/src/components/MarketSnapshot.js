import React, { useState, useEffect, useRef } from "react";
import { axiosGet } from "../apiService";

export const snapshotInstruments = [
  { id: "nifty50", label: "Nifty 50", symbol: "CAPITALCOM:US100", customLabel: "NASDAQ 100" }, 
  { id: "bankNifty", label: "Bank Nifty", symbol: "BINANCE:BTCUSDT", customLabel: "Bitcoin" }, 
  { id: "gold", label: "Gold", symbol: "OANDA:XAUUSD", customLabel: "Gold (Spot)" },
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
    if (!tickerRef.current) return;

    let cancelled = false;
    const targetId = "tradingview-snapshot-ticker-inner";

    const init = () => {
      if (cancelled) return;
      if (!window.TradingView) {
        setTimeout(init, 250);
        return;
      }

      tickerRef.current.innerHTML = "";

      const innerDiv = document.createElement("div");
      innerDiv.id = targetId;
      innerDiv.style.width = "100%";
      innerDiv.style.height = "100%";
      tickerRef.current.appendChild(innerDiv);

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
      if (tickerRef.current) tickerRef.current.innerHTML = "";
    };
  }, [marketData]); 

  const formatRate = (obj) => {
    if (!obj || obj.currentPrice === null || obj.currentPrice === undefined) return "—";
    return Number(obj.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return React.createElement(
    "div",
    { className: "market-summary-shell" },
    
    React.createElement(
      "div",
      { className: "market-summary-card market-summary-rate", style: { padding: "1.1rem" } },
      React.createElement("div", { className: "summary-heading" }, "FOREX RATES (INR)"),
      
      React.createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "1rem" } },
        
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px dashed var(--line)", paddingBottom: "4px" } },
          React.createElement("span", { style: { fontSize: "0.85rem", fontWeight: "600", color: "var(--ink)" } }, "USD / INR"),
          React.createElement("span", { style: { fontSize: "1.1rem", fontFamily: "var(--font-mono)", fontWeight: "700" } }, "₹" + formatRate(marketData?.usdInr))
        ),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px dashed var(--line)", paddingBottom: "4px" } },
          React.createElement("span", { style: { fontSize: "0.85rem", fontWeight: "600", color: "var(--ink)" } }, "EUR / INR"),
          React.createElement("span", { style: { fontSize: "1.1rem", fontFamily: "var(--font-mono)", fontWeight: "700" } }, "₹" + formatRate(marketData?.eurInr))
        ),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
          React.createElement("span", { style: { fontSize: "0.85rem", fontWeight: "600", color: "var(--ink)" } }, "GBP / INR"),
          React.createElement("span", { style: { fontSize: "1.1rem", fontFamily: "var(--font-mono)", fontWeight: "700" } }, "₹" + formatRate(marketData?.gbpInr))
        )
      ),
      
      React.createElement("div", { className: "summary-subtitle", style: { marginTop: "1rem" } }, error ? error : loading ? "Updating..." : "ExchangeRate-API Reference")
    ),

    React.createElement(
      "div",
      { className: "market-summary-card market-summary-ticker" },
      React.createElement("div", { className: "ticker-header" }, "MARKET SNAPSHOT"),
      React.createElement("div", {
        className: "tradingview-snapshot-canvas-wrapper",
        ref: tickerRef
      })
    )
  );
}
