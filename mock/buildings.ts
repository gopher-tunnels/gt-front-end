import { BuildingInfo } from "../@types/api";

export const mockOpenTimes = Array.from({ length: 7 }, () =>
  new Date(2024, 8, 23, 9, 0, 0).toString(),
) as BuildingInfo["opens"];
export const mockClosedTimes = Array.from({ length: 7 }, () =>
  new Date(2024, 8, 23, 18, 0, 0).toString(),
) as BuildingInfo["closes"];
