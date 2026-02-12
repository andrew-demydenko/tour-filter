import { useQuery } from "@tanstack/react-query";
import { getHotels } from "../services/api";
import type { Hotel } from "../types";

const fetchHotels = async (countryId: string): Promise<Hotel[]> => {
  const response = await getHotels(countryId);
  const data: {
    [key: string]: Hotel;
  } = await response.json();
  return Object.values(data).map((hotel) => {
    return {
      ...hotel,
      id: String(hotel.id),
    };
  });
};

export const useHotels = (countryId: string | null) => {
  const query = useQuery({
    queryKey: ["hotels", countryId],
    queryFn: () => fetchHotels(countryId!),
    enabled: !!countryId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    hotels: query.data || [],
    getHotelById: (hotelId: string): Hotel | undefined => {
      return query.data?.find((h) => h.id === hotelId);
    },
  };
};
