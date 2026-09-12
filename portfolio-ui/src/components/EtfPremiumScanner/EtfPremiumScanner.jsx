import React, { useEffect, useState } from "react";
import { formatMarketRate, formatPercent, getEtfPremiumScan } from "../../services/marketService";
import "./EtfPremiumScanner.css";

export default function EtfPremiumScanner() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRows() {
      try {
        setLoading(true);
        setError(null);
        const data = await getEtfPremiumScan();
        setRows(data || []);
      } catch (err) {
        console.error("Failed to load ETF premium scan:", err);
        setError("Unable to load ETF premium data right now.");
      } finally {
        setLoading(false);
      }
    }

    loadRows();
  }, []);

  return (
    <div className="etf-scanner">
      <div className="etf-scanner-header">
        <div>
          <span className="etf-kicker">ETF PREMIUM / DISCOUNT</span>
          <h2>Scanner</h2>
        </div>
        <span className="etf-status">{loading ? "Loading..." : `${rows.length} tracked`}</span>
      </div>

      {error ? (
        <p className="etf-error">{error}</p>
      ) : (
        <div className="etf-table-wrap">
          <table className="etf-table">
            <thead>
              <tr>
                <th>ETF</th>
                <th>Market Price</th>
                <th>NAV</th>
                <th>Premium / Discount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="etf-empty">
                    {loading ? "Fetching latest ETF prices..." : "No ETF data available."}
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const premiumValue = Number(row.premiumPercent ?? 0);
                  const toneClass = premiumValue > 0 ? "premium-positive" : premiumValue < 0 ? "premium-negative" : "premium-neutral";

                  return (
                    <tr key={row.ticker}>
                      <td>
                        <div className="etf-name">{row.name}</div>
                        <small>{row.ticker}</small>
                      </td>
                      <td>{row.marketPrice ? `$${formatMarketRate(row.marketPrice)}` : "—"}</td>
                      <td>{row.navPrice ? `$${formatMarketRate(row.navPrice)}` : "—"}</td>
                      <td className={toneClass}>{row.premiumPercent !== null && row.premiumPercent !== undefined ? formatPercent(row.premiumPercent) : "—"}</td>
                      <td>{row.status === "Available" ? row.message : row.message || row.status}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
