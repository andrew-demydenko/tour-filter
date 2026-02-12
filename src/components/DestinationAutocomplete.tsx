import { useState, useRef, useEffect, type ReactNode, useMemo } from "react";
import { useCountries } from "../hooks/useCountries";
import { useDestinationSearch } from "../hooks/useDestinationSearch";
import { debounce } from "../utils/debounce";
import type { Destination } from "../types";
import { Loader } from "./Loader";

interface DestinationAutocompleteProps {
  selectedDestination?: Destination | null;
  onChangeDestination: (selectedDestination: Destination | null) => void;
}

const getTypeIcon = (destination: Destination): string | ReactNode => {
  if (destination.type === "country") {
    if ("flag" in destination) {
      return (
        <img
          width={20}
          height={10}
          src={destination.flag}
          alt={destination.name}
        />
      );
    }
  } else if (destination.type === "city") {
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
  } else if (destination.type === "hotel") {
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

export const DestinationAutocomplete = ({
  selectedDestination,
  onChangeDestination,
}: DestinationAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selectedDestination?.name || "");
  const [searchValue, setSearchValue] = useState(
    selectedDestination?.name || ""
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: countries, isLoading: isSearchingCountries } = useCountries();
  const { data: searchResults, isLoading: isSearchingDestination } =
    useDestinationSearch(searchValue);

  const debouncedSetSearchValue = useMemo(
    () =>
      debounce((value: unknown) => {
        setSearchValue(value as string);
        if (!value) {
          onChangeDestination(null);
        }
      }, 300),
    [onChangeDestination]
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

  const handleOptionClick = (destination: Destination) => {
    setIsOpen(false);
    setInputValue(destination.name);
    onChangeDestination(destination);
  };

  const getDisplayName = (destination: Destination): string => {
    if ("flag" in destination) {
      return `${destination.name}`;
    }
    if ("countryName" in destination) {
      return `${destination.countryName}, ${destination.cityName} - ${destination.name}`;
    }
    if ("cityName" in destination) {
      return destination.name;
    }
    return destination.name;
  };

  const clearSelectedDestination = () => {
    setInputValue("");
    setSearchValue("");
    onChangeDestination(null);
    setIsOpen(false);
  };

  const displayOptions = useMemo(() => {
    if (
      (selectedDestination?.type === "country" &&
        selectedDestination?.name === searchValue) ||
      !searchValue
    ) {
      return countries || [];
    } else if (searchValue && searchResults) {
      return searchResults || [];
    }

    return [];
  }, [searchResults, countries, selectedDestination, searchValue]);

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
              clearSelectedDestination();
            }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
          >
            ⨉
          </div>
        )}
      </div>

      {isOpen && (
        <div className="w-full mt-2 max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isSearchingCountries || isSearchingDestination ? (
            <Loader />
          ) : displayOptions.length ? (
            displayOptions.map((destination) => (
              <div
                key={destination.id}
                onClick={() => handleOptionClick(destination)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer"
              >
                <span>{getTypeIcon(destination)}</span>
                <span className="truncate">{getDisplayName(destination)}</span>
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
