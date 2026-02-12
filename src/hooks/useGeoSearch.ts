import { useQuery } from "@tanstack/react-query";
import { searchGeo } from "../services/api";
import { type GeoObject } from "../services/api";

export const useGeoSearch = (searchString: string) => {
  return useQuery({
    queryKey: ["geoSearch", searchString],
    queryFn: async (): Promise<GeoObject[]> => {
      const response = await searchGeo(searchString);
      const data = await response.json();

      return Object.keys(data).map((geoObjectId: string) => {
        const geoObject = data[geoObjectId];
        return {
          ...geoObject,
          id: geoObjectId,
        };
      });
    },
    enabled: searchString.length > 0,
  });
};
