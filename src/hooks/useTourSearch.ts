import { useQuery } from "@tanstack/react-query";
import { startSearchPrices, getSearchPrices } from "../services/api";
import { setSearchToken } from "../stores/searchTokenStore";
import type { Price } from "../types";

const MAX_RETRIES = 2;
const SEARCH_TIMEOUT_MS = 60000;

const fetchTours = async (countryId: string): Promise<Price[]> => {
  const startTime = Date.now();

  const startResponse = await startSearchPrices(countryId);
  const startData = await startResponse.json();
  setSearchToken(startData.token);

  const waitUntil = new Date(startData.waitUntil).getTime();
  const now = Date.now();
  const delayMs = Math.max(0, waitUntil - now);

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  let pricesData: { prices: Record<string, Price> } = {
    prices: {},
  };
  let retryAttempt = 0;

  try {
    const pricesResponse = await getSearchPrices(startData.token);
    pricesData = await pricesResponse.json();
  } catch (error) {
    const err = error as unknown as Response;
    const errorData = await err.json();
    while (retryAttempt < MAX_RETRIES) {
      const newWaitUntil = new Date(errorData.waitUntil!).getTime();
      // api return 0 if waitUntil is in the past
      const newDelayMs = Math.max(0, newWaitUntil - Date.now()) || 2000;

      await new Promise((resolve) => setTimeout(resolve, newDelayMs));
      if (errorData.code === 425) {
        if (Date.now() - startTime > SEARCH_TIMEOUT_MS) {
          throw new Error("Таймаут пошуку турів. Спробуйте пізніше.");
        }

        continue;
      } else if (errorData.code === 404 && retryAttempt < MAX_RETRIES) {
        retryAttempt++;
      } else {
        throw errorData;
      }
    }
  }
  setSearchToken(null);

  if (!pricesData || !pricesData.prices) {
    return [];
  }

  const prices = Object.values(pricesData.prices).map((price: Price) => {
    return {
      ...price,
      id: String(price.id),
      hotelID: String(price.hotelID),
    };
  }) as Price[];

  if (prices.length === 0) {
    return [];
  }

  return prices;
};

export const useTourSearch = (countryId: string | null) => {
  const query = useQuery({
    queryKey: ["tours", countryId],
    queryFn: () => fetchTours(countryId!),
    enabled: !!countryId,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    ...query,
    tours: query.data || [],
  };
};
