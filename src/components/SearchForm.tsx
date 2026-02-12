import { useState } from "react";
import { GeoObjectAutocomplete } from "./GeoObjectAutocomplete";
import type { GeoObject } from "../types";

export const SearchForm = ({
  onChangeCountryId,
  loading,
}: {
  onChangeCountryId: (countryId: string | null) => void;
  loading: boolean;
}) => {
  const [destination, setDestination] = useState<GeoObject | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) {
      return;
    }

    let countryId: string | undefined;

    if ("flag" in destination) {
      countryId = destination.id;
    } else if ("countryId" in destination) {
      countryId = destination.countryId;
    }
    onChangeCountryId(countryId || null);
  };

  const handleDestinationChange = async (geo: GeoObject) => {
    setDestination(geo);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <GeoObjectAutocomplete
          value={destination?.name || ""}
          onChangeDestination={handleDestinationChange}
        />
        <button
          disabled={loading || !destination}
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Знайти
        </button>
      </div>
    </form>
  );
};
