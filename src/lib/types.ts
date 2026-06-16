export type Gender = "female" | "male";
export type BodyType = "slim" | "balanced" | "curvy" | "strong";
export type PoseId = "front" | "side" | "back" | "walk" | "akimbo" | "lookdown" | "sit";
export type GarmentCategory = "hat" | "glasses" | "inner" | "top" | "coat" | "belt" | "pants" | "socks" | "shoes";

export interface BodyProfile {
  gender: Gender;
  height: number;
  weight: number;
  bodyType: BodyType;
}

export interface GarmentMeasurements {
  chest?: number;
  waist?: number;
  hip?: number;
  length?: number;
  inseam?: number;
  hem?: number;
}

export interface Garment {
  id: string;
  name: string;
  category: GarmentCategory;
  color: string;
  accent: string;
  sizes: Record<string, GarmentMeasurements>;
  defaultSize: string;
  fabric: { thickness: number; stretch: number; stiffness: number; drape: number };
  silhouette: "fitted" | "regular" | "relaxed" | "oversized";
}

export interface OutfitSelection {
  [category: string]: { garmentId: string; size: string } | undefined;
}

export interface FitResult {
  garmentId: string;
  fit: "紧身" | "合身" | "微宽松" | "宽松";
  length: "偏短" | "适中" | "偏长";
  wrinkle: string;
  score: number;
}
