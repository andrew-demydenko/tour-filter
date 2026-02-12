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
  const [geoObject, setGeoObject] = useState<GeoObject | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!geoObject) {
      return;
    }

    let countryId: string | undefined;

    if ("flag" in geoObject) {
      countryId = geoObject.id;
    } else if ("countryId" in geoObject) {
      countryId = geoObject.countryId;
    }
    onChangeCountryId(countryId || null);
  };

  const handleGeoObjectChange = async (geo: GeoObject | null) => {
    setGeoObject(geo);

    if (!geo) {
      onChangeCountryId(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative h-[160px] mb-6">
        <div className="absolute w-full top-0 left-0 flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <GeoObjectAutocomplete
            selectedGeoObject={geoObject}
            onChangeGeoObject={handleGeoObjectChange}
          />
          <button
            disabled={loading || !geoObject}
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
