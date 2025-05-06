import axios from "axios";
import type {
  GetBuildingsResponse,
  GetPopularResponse,
  GetRouteResponse,
  GetSearchResponse,
} from "../@types/api";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api`,
});

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
  // TODO (+back-end): destination should be building id returned from `GetBuildingsResponse` item
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
