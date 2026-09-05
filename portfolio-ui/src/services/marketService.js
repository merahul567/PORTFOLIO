import { axiosGet } from "../apiService";

export function getMarketSnapshot() {
  return axiosGet("market/snapshot");
}

export function formatMarketRate(value) {
  if (value === null || value === undefined) return "—";

  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}