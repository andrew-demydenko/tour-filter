import { useState } from "react";
import { SearchForm, TourList, useTourPricesSearch } from "@/features/TourSearch";
import { Loader, ErrorMessage } from "@/shared/ui";

export const TourSearchWidget = () => {
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
