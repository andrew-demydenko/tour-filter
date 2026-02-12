import type { Hotel } from "./geoObject.types";

export interface Price {
  id: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  hotelID: string;
}

export interface Tour {
  price: Price;
  hotel: Hotel;
}

export interface SearchStartResponse {
  token: string;
  waitUntil: string;
}

export interface SearchPricesResponse {
  prices: Record<string, Price>;
}

export interface SearchError {
  code: number;
  error: boolean;
  message: string;
  waitUntil?: string;
}

export type SearchStatus = "idle" | "loading" | "success" | "error";

export interface TourSearchResult {
  status: SearchStatus;
  tours: Tour[];
  error?: string;
}
