import React, { useState, useEffect, useRef } from "react";
import { axiosGet } from "../apiService";
import "./MarketDashboard.css";

const widgetConfigs = [
  { id: "tradingview-nasdaq", title: "NASDAQ 100 Index", symbol: "CAPITALCOM:US100", description: "US Tech Benchmark (USD)" },
  { id: "tradingview-bitcoin", title: "Bitcoin", symbol: "BINANCE:BTCUSDT", description: "Crypto Token (USD)" },
  { id: "tradingview-gold-global", title: "Gold", symbol: "OANDA:XAUUSD", description: "Global Spot Gold (USD)" },
];

const DashboardChartCard = (props) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let retryTimer;
    const targetId = props.id + "-container-dashboard";

    const init = () => {
      if (cancelled) return;
      if (!window.TradingView) {
        // poll until TradingView SDK is available (short timeout)
        retryTimer = setTimeout(init, 250);
        return;
      }

      container.innerHTML = "";

      const innerDiv = document.createElement("div");
      innerDiv.id = targetId;
      innerDiv.style.width = "100%";
      innerDiv.style.height = "100%";
      container.appendChild(innerDiv);

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
      clearTimeout(retryTimer);
      container.innerHTML = "";
    };
  }, [props.id, props.symbol]);

  return React.createElement(
    "div",
    { className: "tradingview-widget-card" },
    React.createElement(
      "div",
      { className: "widget-card-header" },
      React.createElement("h3", null, props.title),
      React.createElement("span", null, props.description)
    ),
    React.createElement("div", {
      className: "tradingview-widget",
      ref: containerRef
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
              className: "dashboard-rate-row-grid"
            },
            
            React.createElement("div", { className: "dashboard-rate-item" },
              React.createElement("span", { className: "dashboard-rate-label" }, "USD / INR"),
              React.createElement("div", { className: "rate-value" }, "₹" + formatRate(marketData?.usdInr))
            ),
            
            React.createElement("div", { className: "dashboard-rate-item" },
              React.createElement("span", { className: "dashboard-rate-label" }, "EUR / INR"),
              React.createElement("div", { className: "rate-value" }, "₹" + formatRate(marketData?.eurInr))
            ),
            
            React.createElement("div", { className: "dashboard-rate-item" },
              React.createElement("span", { className: "dashboard-rate-label" }, "GBP / INR"),
              React.createElement("div", { className: "rate-value" }, "₹" + formatRate(marketData?.gbpInr))
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
      { className: "dashboard-footer" },
      React.createElement("p", { className: "note" }, "Charts generated natively via TradingView Client Web Framework interfaces.")
    )
  );
}
