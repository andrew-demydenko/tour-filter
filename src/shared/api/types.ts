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
