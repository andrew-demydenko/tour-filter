export type GeoType = "country" | "city" | "hotel";

export interface Country {
  id: string;
  name: string;
  flag: string;
  type?: GeoType;
}

export interface City {
  id: number;
  name: string;
  countryId: string;
  type?: GeoType;
}

export interface Hotel {
  id: number;
  name: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
  img?: string;
  type?: GeoType;
}

export type GeoObject = Country | City | Hotel;
