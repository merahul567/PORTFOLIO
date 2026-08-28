import React, { useState, useEffect, useRef } from "react";
import { axiosGet } from "../apiService";

const widgetConfigs = [
  { id: "tradingview-nasdaq", title: "NASDAQ 100 Index", symbol: "CAPITALCOM:US100", description: "US Tech Benchmark (USD)" },
  { id: "tradingview-bitcoin", title: "Bitcoin", symbol: "BINANCE:BTCUSDT", description: "Crypto Token (USD)" },
  { id: "tradingview-gold-global", title: "Gold (Spot)", symbol: "OANDA:XAUUSD", description: "Global Spot Gold (USD)" },
];

const DashboardChartCard = (props) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    const targetId = props.id + "-container-dashboard";

    const init = () => {
      if (cancelled) return;
      if (!window.TradingView) {
        // poll until TradingView SDK is available (short timeout)
        setTimeout(init, 250);
        return;
      }

      containerRef.current.innerHTML = "";

      const innerDiv = document.createElement("div");
      innerDiv.id = targetId;
      innerDiv.style.width = "100%";
      innerDiv.style.height = "100%";
      containerRef.current.appendChild(innerDiv);

      // Use the official widget constructor to match the SDK
      new window.TradingView.widget({
        container_id: targetId,
        symbol: props.symbol,
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
    };

    init();

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [props.id, props.symbol]);

  return React.createElement(
    "div",
    { className: "tradingview-widget-card" },
    React.createElement(
      "div",
      { className: "widget-card-header", style: { padding: "1rem 1.2rem 0.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
      React.createElement("h3", { style: { fontSize: "1.1rem", fontWeight: "600", margin: 0 } }, props.title),
      React.createElement("span", { style: { fontSize: "0.75rem", color: "var(--muted)" } }, props.description)
    ),
    React.createElement("div", {
      className: "tradingview-widget",
      ref: containerRef,
      style: { width: "100%", height: "340px", display: "block", background: "transparent" }
    })
  );
};

export default function MarketDashboard() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketSnapshot = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await axiosGet("market/snapshot");
        setMarketData(data || null);
      } catch (err) {
        console.error("Failed to fetch dashboard forex data:", err);
        setError("Unable to load references. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMarketSnapshot();
  }, []);

  const formatRate = (obj) => {
    if (!obj || obj.currentPrice === null || obj.currentPrice === undefined) return "—";
    return Number(obj.currentPrice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return React.createElement(
    "div",
    { className: "market-dashboard" },
    
    React.createElement(
      "div",
      { className: "market-rate-panel" },
      React.createElement(
        "div",
        { className: "rate-header" },
        React.createElement(
          "div",
          null,
          React.createElement("span", { className: "rate-label" }, "LIVE REFERENCE RATES"),
          React.createElement("h3", null, "ExchangeRate-API Reference Indexes")
        ),
        React.createElement("span", { className: "rate-source" }, loading ? "Syncing..." : "Live feed active")
      ),
      
      error 
        ? React.createElement("p", { className: "rate-error" }, error)
        : React.createElement(
            "div",
            { 
              className: "dashboard-rate-row-grid",
              style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "1rem" } 
            },
            
            React.createElement("div", { style: { borderRight: "1px dashed var(--line)", paddingRight: "1rem" } },
              React.createElement("span", { style: { fontSize: "0.75rem", textTransform: "uppercase", color: "var(--faint)", fontWeight: "600" } }, "USD / INR"),
              React.createElement("div", { className: "rate-value", style: { fontSize: "1.9rem", marginTop: "4px" } }, "₹" + formatRate(marketData?.usdInr))
            ),
            
            React.createElement("div", { style: { borderRight: "1px dashed var(--line)", paddingRight: "1rem" } },
              React.createElement("span", { style: { fontSize: "0.75rem", textTransform: "uppercase", color: "var(--faint)", fontWeight: "600" } }, "EUR / INR"),
              React.createElement("div", { className: "rate-value", style: { fontSize: "1.9rem", marginTop: "4px" } }, "₹" + formatRate(marketData?.eurInr))
            ),
            
            React.createElement("div", null,
              React.createElement("span", { style: { fontSize: "0.75rem", textTransform: "uppercase", color: "var(--faint)", fontWeight: "600" } }, "GBP / INR"),
              React.createElement("div", { className: "rate-value", style: { fontSize: "1.9rem", marginTop: "4px" } }, "₹" + formatRate(marketData?.gbpInr))
            )
          )
    ),

    React.createElement(
      "div",
      { className: "market-widget-grid" },
      widgetConfigs.map((config) =>
        React.createElement(DashboardChartCard, Object.assign({ key: config.id }, config))
      )
    ),

    React.createElement(
      "div",
      { className: "dashboard-footer", style: { marginTop: "2rem", borderTop: "1px solid var(--line)", paddingTop: "1rem" } },
      React.createElement("p", { className: "note", style: { fontSize: "0.8rem", color: "var(--muted)" } }, "Charts generated natively via TradingView Client Web Framework interfaces.")
    )
  );
}
