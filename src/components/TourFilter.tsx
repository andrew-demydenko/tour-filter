import { useState } from "react";
import { SearchForm } from "../components/SearchForm";
import { useTourSearch } from "../hooks/useTourSearch";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { TourList } from "../components/TourList";

export const TourFilter = () => {
  const [countryId, setCountryId] = useState<string | null>(null);
  const { tours: prices, isLoading, isError, error } = useTourSearch(countryId);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <SearchForm loading={isLoading} onChangeCountryId={setCountryId} />

      {isLoading && <Loader />}

      {isError && (
        <ErrorMessage message={error?.message || "Сталася помилка"} />
      )}

      {!isLoading && !isError && countryId && (
        <div className="mt-6">
          <TourList prices={prices} countryId={countryId} />
        </div>
      )}
    </div>
  );
};
