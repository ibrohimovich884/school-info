// Serverning bazaviy manzili
const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const rawDeviceIp = (import.meta.env.VITE_DEVICE_IP || "").trim();

let resolvedUrl = "https://four0-mak-server-3.onrender.com";

if (rawApiUrl.startsWith("http://") || rawApiUrl.startsWith("https://")) {
  if (!rawApiUrl.includes("localhost") && !rawApiUrl.includes("127.0.0.1")) {
    resolvedUrl = rawApiUrl;
  } else if (rawDeviceIp.startsWith("http")) {
    // Agar VITE_DEVICE_IP da haqiqiy render server berilgan bo'lsa
    resolvedUrl = rawDeviceIp;
  }
} else if (rawDeviceIp.startsWith("http")) {
  resolvedUrl = rawDeviceIp;
}

export const API_URL = resolvedUrl.replace(/\/+$/, "");