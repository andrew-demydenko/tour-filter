import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  useMemo,
} from "react";
import { useCountries } from "../hooks/useCountries";
import { useGeoSearch } from "../hooks/useGeoSearch";
import { debounce } from "../utils/debounce";
import type { GeoObject } from "../types";
import { Loader } from "./Loader";

interface GeoObjectAutocompleteProps {
  value: string;
  onChangeDestination: (selectedGeo: GeoObject) => void;
}

const getTypeIcon = (geo: GeoObject): string | ReactNode => {
  if (geo.type === "country") {
    if ("flag" in geo) {
      return <img width={20} height={10} src={geo.flag} alt={geo.name} />;
    }
  } else if (geo.type === "city") {
    return "🏙️";
  } else if (geo.type === "hotel") {
    return "🏨";
  }
};

export const GeoObjectAutocomplete = ({
  value,
  onChangeDestination,
}: GeoObjectAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [searchValue, setSearchValue] = useState(value);
  const [selectedGeo, setSelectedGeo] = useState<GeoObject | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: countries, isLoading: isSearchingCountries } = useCountries();
  const { data: searchResults, isLoading: isSearchingGeo } =
    useGeoSearch(searchValue);

  const debouncedSetSearchValue = useCallback(
    debounce((value: unknown) => {
      setSearchValue(value as string);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSetSearchValue(inputValue);
  }, [inputValue, debouncedSetSearchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleOptionClick = (geo: GeoObject) => {
    setSelectedGeo(geo);
    setIsOpen(false);
    setInputValue(geo.name);
    onChangeDestination(geo);
  };

  const getDisplayName = (geo: GeoObject): string => {
    if ("flag" in geo) {
      return `${geo.name}`;
    }
    if ("countryName" in geo) {
      return `${geo.countryName}, ${geo.cityName} - ${geo.name}`;
    }
    if ("cityName" in geo) {
      return geo.name;
    }
    return geo.name;
  };

  const displayOptions = useMemo(() => {
    if (
      (selectedGeo?.type === "country" && selectedGeo?.name === searchValue) ||
      !searchValue
    ) {
      return countries || [];
    } else if (searchValue && searchResults) {
      return searchResults || [];
    }

    return [];
  }, [searchResults, countries, selectedGeo, searchValue]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder="Направлення"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {inputValue && (
          <div
            onClick={() => setInputValue("")}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
          >
            ⨉
          </div>
        )}
      </div>

      {isOpen && (
        <div className="w-full mt-2 max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isSearchingCountries || isSearchingGeo ? (
            <Loader />
          ) : displayOptions.length ? (
            displayOptions.map((geo) => (
              <div
                key={geo.id}
                onClick={() => handleOptionClick(geo)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer"
              >
                <span>{getTypeIcon(geo)}</span>
                <span className="truncate">{getDisplayName(geo)}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3">Нічого не знайдено</div>
          )}
        </div>
      )}
    </div>
  );
};
