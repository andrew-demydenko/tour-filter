import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/shared/api";
import type { Country } from "@/entities/Destination";

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async (): Promise<Country[]> => {
      const response = await getCountries();
      const data = await response.json();

      return Object.keys(data).map((countryId: string) => {
        const country = data[countryId];
        return {
          ...country,
          id: countryId,
          type: "country",
        };
      });
    },
    staleTime: 1000 * 60 * 10,
  });
};
