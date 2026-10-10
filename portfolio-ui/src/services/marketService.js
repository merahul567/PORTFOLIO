import { axiosGet } from "../apiService";

export function getMarketSnapshot() {
  return axiosGet("market/snapshot");
}

export function getEtfPremiumScan() {
  return axiosGet("market/etf-premium");
}

export function formatMarketRate(value) {
  if (value === null || value === undefined) return "—";

  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";

  return `${Number(value).toFixed(2)}%`;
}