import { create } from "zustand";

interface storeTypes {
  scene: string;
  animationReady: boolean;
  project: string;
  options: options;
}

export type scenes = "cover" | "overview" | "details" | "about" | "contact";
type preferences = "no-preference" | "reduce";
type options = {
  intensity?: number;
  speed?: number;
};

class Store implements storeTypes {
  options: options;
  setOptions: (options: options) => void;
  prefers: preferences;
  setPrefers: (theme: "no-preference" | "reduce") => void;
  scene: scenes;
  setScene: (scene: scenes) => void;
  showLoader: boolean;
  setLoader: (show: boolean) => void;
  animationReady: boolean;
  setAnimationReady: (ready: boolean) => void;
  project: string;
  setProject: (projectName: string) => void;
  startInterpolation: boolean;
  setStartInterpolation: (start: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  options: {
    intensity: 1.0,
    speed: 1,
  },
  setOptions: (optionsObject) => set({options: optionsObject }),
  prefers: "no-preference",
  setPrefers: (preference) => set({ prefers: preference }),
  scene: "cover",
  setScene: (scene) => set({ scene }),
  showLoader: false,
  setLoader: (show) => set({ showLoader: show }),
  animationReady: false,
  setAnimationReady: (ready) => set({ animationReady: ready }),
  project: "",
  setProject: (projectName) => set({ project: projectName }),
  startInterpolation: false,
  setStartInterpolation: (start) => set({ startInterpolation: start }),
}));
