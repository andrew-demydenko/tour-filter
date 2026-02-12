export type DestinationType = "country" | "city" | "hotel";

export interface Country {
  id: string;
  name: string;
  flag: string;
  type?: DestinationType;
}

export interface City {
  id: string;
  name: string;
  countryId: string;
  type?: DestinationType;
}

export interface Hotel {
  id: string;
  name: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
  img?: string;
  type?: DestinationType;
}

export type Destination = Country | City | Hotel;

export const getCountries: () => Promise<Response>;
export const searchGeo: (searchString: string) => Promise<Response>;
export const startSearchPrices: (countryID: string) => Promise<Response>;
export const getSearchPrices: (token: string) => Promise<Response>;
export const stopSearchPrices: (token: string) => Promise<Response>;
export const getHotels: (countryID: string) => Promise<Response>;
export const getHotel: (hotelId: number) => Promise<Response>;
export const getPrice: (priceId: string) => Promise<Response>;
