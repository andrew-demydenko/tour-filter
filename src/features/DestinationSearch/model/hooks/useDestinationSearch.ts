import { useQuery } from "@tanstack/react-query";
import { searchGeo } from "@/shared/api";
import type { Destination } from "@/entities/Destination";

export const useDestinationSearch = (searchString: string) => {
  return useQuery({
    queryKey: ["destinationSearch", searchString],
    queryFn: async (): Promise<Destination[]> => {
      const response = await searchGeo(searchString);
      const data = await response.json();

      return Object.keys(data).map((destinationId: string) => {
        const destination = data[destinationId];
        return {
          ...destination,
          id: destinationId,
        };
      });
    },
    enabled: searchString.length > 0,
  });
};
