import { create } from 'zustand';

interface storeTypes {
  scene: string;
  setScene: (scene: typeof this.scene) => void;
  animationReady: boolean;
  setAnimationReady: (ready: boolean) => void;
  fadeOverlay: () => void;
};

type scenes = "cover" | "overview" | "details";

class Store implements storeTypes {
  scene: scenes;
  setScene: (scene: scenes) => void;
  showLoader: boolean;
  setLoader: (show: boolean) => void;
  animationReady: boolean;
  setAnimationReady: (ready: boolean) => void;
  fadeOverlay: () => void;
};

export const useStore = create<Store>((set) => ({
  scene: "cover",
  setScene: (scene) => set({ scene }),
  showLoader: false,
  setLoader: (show) => set({ showLoader: show }),
  animationReady: false,
  setAnimationReady: (ready) => set({ animationReady: ready }),
  fadeOverlay: () => {
    // Fade out overlay
  },
}));
