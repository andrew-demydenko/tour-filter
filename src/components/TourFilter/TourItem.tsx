import type { Tour } from "@/types";
import { memo } from "react";

interface TourCardProps {
  tour: Tour;
}

export const TourItem = memo(({ tour }: TourCardProps) => {
  const { price, hotel } = tour;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateNights = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights(price.startDate, price.endDate);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-200">
      {hotel.img && (
        <div className="aspect-video overflow-hidden bg-gray-200">
          <img
            src={hotel.img}
            alt={hotel.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {hotel.name}
        </h3>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <p className="flex items-center">
            {hotel.cityName}, {hotel.countryName}
          </p>
          <p className="flex items-center">
            {formatDate(price.startDate)} - {formatDate(price.endDate)}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                ${price.amount.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                {` / ${nights} ночей`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
