export const getCountries: () => Promise<Response>;
export const searchGeo: (searchString: string) => Promise<Response>;
export const startSearchPrices: (countryID: string) => Promise<Response>;
export const getSearchPrices: (token: string) => Promise<Response>;
export const stopSearchPrices: (token: string) => Promise<Response>;
export const getHotels: (countryID: string) => Promise<Response>;
export const getHotel: (hotelId: number) => Promise<Response>;
export const getPrice: (priceId: string) => Promise<Response>;
