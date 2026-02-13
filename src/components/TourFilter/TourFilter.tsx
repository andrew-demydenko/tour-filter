import { useState } from "react";
import { SearchForm } from "./SearchForm";
import { useTourPricesSearch } from "@/hooks";
import { Loader } from "../shared/Loader";
import { ErrorMessage } from "../shared/ErrorMessage";
import { TourList } from "./TourList";

export const TourFilter = () => {
  const [countryId, setCountryId] = useState<string | null>(null);
  const { prices, isFetching, isError, error, refetch, cancelQuery } =
    useTourPricesSearch(countryId);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <SearchForm
        currentCountryId={countryId}
        loading={isFetching}
        onChangeCountryId={setCountryId}
        refetch={refetch}
        cancelQuery={cancelQuery}
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
