import { useMemo } from "react";
import { TourItem } from "./TourItem";
import { useHotelDetails } from "@/hooks";
import { Loader } from "../shared/Loader";
import { ErrorMessage } from "../shared/ErrorMessage";
import type { Price, Tour } from "@/types";
import { EmptyList } from "../shared/EmptyList";

interface TourListProps {
  prices: Price[];
  countryId: string;
}

export const TourList = ({ prices, countryId }: TourListProps) => {
  const {
    isLoading: isLoadingHotels,
    isError: isHotelsError,
    error: hotelsError,
    getHotelById,
  } = useHotelDetails(countryId);

  const tours: Tour[] = useMemo(() => {
    return prices
      .map((price) => {
        const hotel = getHotelById(price.hotelID);
        if (!hotel) return null;
        return { price, hotel };
      })
      .filter((tour): tour is Tour => tour !== null);
  }, [prices, getHotelById]);

  if (isLoadingHotels) {
    return <Loader />;
  }

  if (isHotelsError) {
    return (
      <ErrorMessage
        message={hotelsError?.message || "Помилка завантаження готелів"}
      />
    );
  }

  if (tours.length === 0) {
    return <EmptyList message="Не знайдено турів" />;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Знайдено турів: {prices.length}
      </h2>
      <div className="grid grid-cols-1 min-[550px]:grid-cols-2 gap-4 justify-items-center max-w-4xl mx-auto">
        {tours.map((tour) => (
          <div
            key={tour.price.id}
            className="w-full min-w-[250px] max-w-[450px]"
          >
            <TourItem tour={tour} />
          </div>
        ))}
      </div>
    </div>
  );
};
