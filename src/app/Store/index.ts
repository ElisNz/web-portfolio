import { create } from "zustand";

interface storeTypes {
  scene: string;
  animationReady: boolean;
  project: string;
}

type scenes = "cover" | "overview" | "details";
type preferences = "no-preference" | "reduce";

class Store implements storeTypes {
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
