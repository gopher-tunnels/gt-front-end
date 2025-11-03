import axios, { AxiosHeaders } from "axios";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { encode as toBase64 } from "base64-arraybuffer";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import type {
  GetBuildingsResponse,
  GetPopularResponse,
  GetRouteResponse,
  GetSearchResponse,
} from "../@types/api";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api`,
});

const DEVICE_ID_KEY = "apiDeviceId";
const NONCE_BYTE_LENGTH = 16;
const TIMESTAMP_DIVISOR = 1000;

let cachedDeviceId: string | null = null;

const textEncoder =
  typeof TextEncoder !== "undefined" ? new TextEncoder() : null;

const getSecret = () => {
  const secret =
    process.env.API_SHARED_SECRET || process.env.EXPO_PUBLIC_API_SHARED_SECRET;
  if (!secret) {
    throw new Error("Missing API_SHARED_SECRET for request signing");
  }
  return secret;
};

const encodeUtf8 = (value: string) => {
  if (!textEncoder) {
    throw new Error("TextEncoder is not available in this environment");
  }
  return textEncoder.encode(value);
};

const bytesToHex = (bytes: Uint8Array) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const getDeviceId = async (): Promise<string> => {
  if (cachedDeviceId) return cachedDeviceId;

  const stored = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (stored) {
    cachedDeviceId = stored;
    return stored;
  }

  const randomBytes = await Crypto.getRandomBytesAsync(16);
  const id = bytesToHex(randomBytes);
  cachedDeviceId = id;
  await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
  return id;
};

const generateNonce = async (): Promise<string> => {
  const bytes = await Crypto.getRandomBytesAsync(NONCE_BYTE_LENGTH);
  return bytesToHex(bytes);
};

const extractPathWithQuery = (fullUrl: string): string => {
  const schemeIndex = fullUrl.indexOf("://");
  const startIndex =
    schemeIndex >= 0 ? fullUrl.indexOf("/", schemeIndex + 3) : 0;
  const pathWithQuery =
    startIndex >= 0
      ? fullUrl.slice(startIndex)
      : fullUrl.startsWith("/")
        ? fullUrl
        : `/${fullUrl}`;
  const hashIndex = pathWithQuery.indexOf("#");
  return hashIndex >= 0 ? pathWithQuery.slice(0, hashIndex) : pathWithQuery;
};

const normalizePathWithQuery = (pathWithQuery: string): string => {
  const withLeadingSlash = pathWithQuery.startsWith("/")
    ? pathWithQuery
    : `/${pathWithQuery}`;
  const questionIndex = withLeadingSlash.indexOf("?");
  if (questionIndex === -1) return withLeadingSlash;

  const pathname = withLeadingSlash.slice(0, questionIndex);
  const queryString = withLeadingSlash.slice(questionIndex + 1);

  if (!queryString) return pathname;

  const normalizedParts = queryString
    .split("&")
    .filter(Boolean)
    .map((part) => {
      const equalsIndex = part.indexOf("=");
      if (equalsIndex === -1) {
        return encodeURIComponent(part.replace(/\+/g, " "));
      }
      const key = part.slice(0, equalsIndex);
      const value = part.slice(equalsIndex + 1);
      return `${encodeURIComponent(key.replace(/\+/g, " "))}=${encodeURIComponent(
        value.replace(/\+/g, " "),
      )}`;
    });

  return normalizedParts.length
    ? `${pathname}?${normalizedParts.join("&")}`
    : pathname;
};

api.interceptors.request.use(
  async (config) => {
    const secret = getSecret();

    const method = (config.method ?? "get").toUpperCase();
    const urlWithParams = api.getUri(config);
    const pathWithQuery = extractPathWithQuery(urlWithParams);
    const canonicalPath = normalizePathWithQuery(pathWithQuery);

    let bodyString: string;
    if (config.data == null) {
      bodyString = "";
    } else if (typeof config.data === "string") {
      bodyString = config.data;
    } else {
      bodyString = JSON.stringify(config.data);
      config.data = bodyString;
    }

    const deviceId = await getDeviceId();
    const timestamp = Math.floor(Date.now() / TIMESTAMP_DIVISOR).toString();
    const nonce = await generateNonce();

    const canonical = [
      method,
      canonicalPath,
      bodyString,
      deviceId,
      timestamp,
      nonce,
    ].join("\n");

    const mac = hmac(sha256, encodeUtf8(secret), encodeUtf8(canonical));
    const signature = toBase64(
      mac.buffer.slice(mac.byteOffset, mac.byteOffset + mac.byteLength),
    );

    const headers = AxiosHeaders.from(config.headers ?? {});
    headers.set("Content-Type", "application/json");
    headers.set("X-Device-Id", deviceId);
    headers.set("X-Timestamp", timestamp);
    headers.set("X-Nonce", nonce);
    headers.set("X-Signature", signature);
    if (
      process.env.VERCEL_BYPASS_TOKEN ||
      process.env.EXPO_PUBLIC_VERCEL_BYPASS_TOKEN
    ) {
      headers.set(
        "x-vercel-protection-bypass",
        process.env.VERCEL_BYPASS_TOKEN ||
          process.env.EXPO_PUBLIC_VERCEL_BYPASS_TOKEN,
      );
    }

    const appId = process.env.EXPO_PUBLIC_APP_ID;
    if (appId) headers.set("X-App-Id", appId);

    config.headers = headers;

    return config;
  },
  (error) => Promise.reject(error),
);

// * /routing
// /search
export const getSearchResults = async (query: string) => {
  return (
    await api.get<GetSearchResponse>("/routing/search", {
      params: { input: query },
    })
  ).data;
};

// /buildings
export const getBuildings = async () => {
  return (await api.get<GetBuildingsResponse>("/routing/buildings")).data;
};

// /route
export const getRoute = async (
  destination: GetBuildingsResponse[number]["buildingName"],
  latitude: number,
  longitude: number,
) => {
  return (
    await api.get<GetRouteResponse>("/routing/route", {
      params: { targetBuilding: destination, latitude, longitude },
    })
  ).data;
};

// /popular
export const getPopular = async () => {
  return (await api.get<GetPopularResponse>("/routing/popular")).data;
};

export default api;
