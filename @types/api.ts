type Int = number;
interface BuildingInfo {
  id: Int;
  buildingName: string;
  latitude: number;
  longitude: number;
}

// TODO (+back-end): modify after back-end adds other properties
export type GetBuildingsResponse = BuildingInfo[];

export type GetSearchResponse = BuildingInfo[];

interface Step {
  id: Int;
  buildingName: string;
  latitude: number;
  longitude: number;
  floor: string;
  nodeType: string;
  type: string;
}

interface Route {
  steps: Step[];
  totalDistance: number;
  totalTime: number;
}

export type GetRouteResponse = Route[];

export type GetPopularResponse = Omit<BuildingInfo, "latitude" | "longitude">[];
