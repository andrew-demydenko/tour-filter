import { create } from "zustand";
import type { Price } from "@/entities/Tour";

interface TourSearchStore {
  searchToken: string | null;
  tourPrices: Price[];

  setSearchToken: (token: string | null) => void;
  setTourPrices: (tours: Price[]) => void;
  reset: () => void;
}

export const useTourSearchStore = create<TourSearchStore>((set) => ({
  searchToken: null,
  tourPrices: [],

  setSearchToken: (token) => set({ searchToken: token }),

  setTourPrices: (tourPrices) => set({ tourPrices }),

  reset: () =>
    set({
      searchToken: null,
      tourPrices: [],
    }),
}));
