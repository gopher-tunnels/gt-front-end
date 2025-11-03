import type { UserLocationInput } from "../../utils/path";

export type SegmentInput = {
  coordinates: number[][];
  type?: string;
  color?: string;
  startSegmentIndex?: number;
};

export interface PathComponentProps {
  id: string | number;
  // Backward-compatible: single coordinates path
  coordinates?: number[][];
  // New: multiple grouped segments drawn sequentially
  segments?: SegmentInput[];
  lineColor?: string;
  lineWidth?: number;
  durationMs?: number;
  userLocation?: UserLocationInput | null;
}
