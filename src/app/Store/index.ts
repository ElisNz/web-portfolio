import { create } from 'zustand';

type Store = {
  scene: "cover" | "overview" | "details";
  setScene: (scene: "cover" | "overview" | "details") => void;
  animationReady: boolean;
  setAnimationReady: (ready: boolean) => void;
  fadeOverlay: () => void;
};

export const useStore = create<Store>((set) => ({
  scene: "cover",
  setScene: (scene) => set({ scene }),
  animationReady: false,
  setAnimationReady: (ready) => set({ animationReady: ready }),
  fadeOverlay: () => {
    // Fade out overlay
  },
}));
