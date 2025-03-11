import { create } from 'zustand';

interface storeTypes {
  scene: string;
  animationReady: boolean;
  project: string;
};

type scenes = "cover" | "overview" | "details";

class Store implements storeTypes {
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
};

export const useStore = create<Store>((set) => ({
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
