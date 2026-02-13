import { useState } from "react";
import { SearchForm } from "../components/SearchForm";
import { useTourPricesSearch } from "../hooks/useTourPricesSearch";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { TourList } from "../components/TourList";

export const TourFilter = () => {
  const [countryId, setCountryId] = useState<string | null>(null);
  const { prices, isFetching, isError, error, refetch } =
    useTourPricesSearch(countryId);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <SearchForm
        currentCountryId={countryId}
        loading={isFetching}
        onChangeCountryId={setCountryId}
        refetch={refetch}
      />

      {isFetching && <Loader />}

      {isError && (
        <ErrorMessage message={error?.message || "Сталася помилка"} />
      )}

      {!isFetching && !isError && countryId && (
        <div className="mt-6">
          <TourList prices={prices} countryId={countryId} />
        </div>
      )}
    </div>
  );
};
