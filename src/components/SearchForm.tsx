import { useState } from "react";
import { DestinationAutocomplete } from "./DestinationAutocomplete";
import type { Destination } from "../types";
import { useStopSearch } from "../hooks/useStopSearch";
import { getSearchToken } from "../stores/searchTokenStore";

export const SearchForm = ({
  onChangeCountryId,
  loading,
}: {
  onChangeCountryId: (countryId: string | null) => void;
  loading: boolean;
}) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const { stopSearch } = useStopSearch({
    // In documentation we need to disable button "Знайти" when loading
    // but here we need to run new search without clicking "Знайти" button, Logic is little strange
    // Не запускайте пошук доки попередній пошук не був завершений (наприклад, disable кнопки «Знайти»).
    // Після завершення stopSearchPrices: запустити новий пошук за оновленими параметрами
    onSuccess: () => {
      if (!destination) {
        return;
      }
      onChangeCountryId(getCountryId(destination));
    },
  });

  const getCountryId = (destination: Destination) => {
    let countryId: string | null = null;

    if (!destination) {
      return countryId;
    }
    if ("flag" in destination) {
      countryId = destination.id;
    } else if ("countryId" in destination) {
      countryId = destination.countryId;
    }

    return countryId;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination) {
      return;
    }

    const countryId = getCountryId(destination);

    onChangeCountryId(countryId);
  };

  const handleDestinationChange = async (destination: Destination | null) => {
    setDestination(destination);

    if (!destination || destination?.id !== destination.id) {
      onChangeCountryId(null);
    }

    const token = getSearchToken();
    if (token) {
      stopSearch(token);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative h-[160px] mb-6">
        <div className="absolute z-10 w-full top-0 left-0 flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <DestinationAutocomplete
            selectedDestination={destination}
            onChangeDestination={handleDestinationChange}
          />
          <button
            disabled={loading || !destination}
            type="submit"
            className="cursor-pointer w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Знайти
          </button>
        </div>
      </div>
    </form>
  );
};
