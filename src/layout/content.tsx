import { useState } from "react";
import { SearchForm } from "../components/SearchForm";
import { useTourSearch } from "../hooks/useTourSearch";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { EmptyList } from "../components/EmptyList";

export const Content = () => {
  const [countryId, setCountryId] = useState<string | null>(null);
  const { tours, isLoading, isError, error } = useTourSearch(countryId);

  return (
    <div className="container mx-auto flex-1 py-6 flex">
      <div className="w-full max-w-4xl mx-auto">
        <SearchForm loading={isLoading} onChangeCountryId={setCountryId} />

        {isLoading && <Loader />}

        {isError && (
          <ErrorMessage message={error?.message || "Сталася помилка"} />
        )}

        {!isLoading && !isError && tours.length === 0 && countryId && (
          <EmptyList />
        )}

        {!isLoading && !isError && tours.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Знайдено турів: {tours.length}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};
