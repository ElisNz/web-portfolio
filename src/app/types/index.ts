import { Vector3 } from "three";

type ImportModel = {
  name: string;
  format: string;
};

type HitBox = {
  size: [number, number, number];
  position: Vector3;
  geometry: "box" | "sphere" | "cone";
};

export type { ImportModel, HitBox };
