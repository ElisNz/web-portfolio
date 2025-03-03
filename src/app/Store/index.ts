import { create } from 'zustand';

interface storeTypes {
  scene: string;
  setScene: (scene: typeof this.scene) => void;
  animationReady: boolean;
  setAnimationReady: (ready: boolean) => void;
  selectedPosition: { x: number; y: number };
  setSelectedPosition: (position: { x: number; y: number }) => void;
  fadeOverlay: () => void;
};

type scenes = "cover" | "overview" | "details";

class Store implements storeTypes {
  scene: scenes;
  setScene: (scene: scenes) => void;
  animationReady: boolean;
  setAnimationReady: (ready: boolean) => void;
  selectedPosition: { x: number; y: number };
  setSelectedPosition: (position: { x: number; y: number }) => void;
  fadeOverlay: () => void;
};

export const useStore = create<Store>((set) => ({
  scene: "cover",
  setScene: (scene) => set({ scene }),
  animationReady: false,
  setAnimationReady: (ready) => set({ animationReady: ready }),
  selectedPosition: { x: 0, y: 0 },
  setSelectedPosition: (position) => set({ selectedPosition: position }),
  fadeOverlay: () => {
    // Fade out overlay
  },
}));
