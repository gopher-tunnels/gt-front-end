type Int = number;
export interface BuildingInfo {
  id: Int;
  buildingName: string;
  address: string;
  latitude: number;
  longitude: number;
  opens: [string, string, string, string, string, string, string];
  closes: [string, string, string, string, string, string, string];
}

// TODO (+back-end): modify after back-end adds other properties
export type GetBuildingsResponse = BuildingInfo[];

export type GetSearchResponse = BuildingInfo[];

interface Step {
  id: Int;
  instruction: {
    type: "enter" | "forward" | "left" | "right" | "elevator" | "final";
    label?: string;
  };
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

export type GetRouteResponse = Route;

export type GetPopularResponse = Omit<BuildingInfo, "latitude" | "longitude">[];
