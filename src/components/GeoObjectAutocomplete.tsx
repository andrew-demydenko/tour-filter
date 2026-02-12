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
  selectedGeoObject?: GeoObject | null;
  onChangeGeoObject: (selectedGeo: GeoObject | null) => void;
}

const getTypeIcon = (geo: GeoObject): string | ReactNode => {
  if (geo.type === "country") {
    if ("flag" in geo) {
      return <img width={20} height={10} src={geo.flag} alt={geo.name} />;
    }
  } else if (geo.type === "city") {
    return (
      <svg
        className="text-gray-500"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4 8 4v14" />
        <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11H9V10z" />
      </svg>
    );
  } else if (geo.type === "hotel") {
    return (
      <svg
        className="text-gray-500"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18" />
        <path d="M5 21V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v12" />
        <path d="M13 21V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v16" />
        <path d="M6 10v0" />
        <path d="M14 7v0" />
        <path d="M14 12v0" />
      </svg>
    );
  }
};

export const GeoObjectAutocomplete = ({
  selectedGeoObject,
  onChangeGeoObject,
}: GeoObjectAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selectedGeoObject?.name || "");
  const [searchValue, setSearchValue] = useState(selectedGeoObject?.name || "");
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: countries, isLoading: isSearchingCountries } = useCountries();
  const { data: searchResults, isLoading: isSearchingGeo } =
    useGeoSearch(searchValue);

  const debouncedSetSearchValue = useCallback(
    debounce((value: unknown) => {
      setSearchValue(value as string);
      if (!value) {
        onChangeGeoObject(null);
      }
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
    setIsOpen(false);
    setInputValue(geo.name);
    onChangeGeoObject(geo);
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

  const clearSelectedGeo = () => {
    setInputValue("");
    setSearchValue("");
    onChangeGeoObject(null);
    setIsOpen(false);
  };

  const displayOptions = useMemo(() => {
    if (
      (selectedGeoObject?.type === "country" &&
        selectedGeoObject?.name === searchValue) ||
      !searchValue
    ) {
      return countries || [];
    } else if (searchValue && searchResults) {
      return searchResults || [];
    }

    return [];
  }, [searchResults, countries, selectedGeoObject, searchValue]);

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
            onClick={() => {
              clearSelectedGeo();
            }}
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
