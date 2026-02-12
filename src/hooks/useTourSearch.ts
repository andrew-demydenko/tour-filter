import { useQuery } from "@tanstack/react-query";
import { startSearchPrices, getSearchPrices } from "../services/api";
// import type { Tour } from "../types";

const MAX_RETRIES = 2;
const SEARCH_TIMEOUT_MS = 60000;

const fetchTours = async (countryId: string): Promise<any[]> => {
  const startTime = Date.now();

  const startResponse = await startSearchPrices(countryId);
  const startData = await startResponse.json();

  const waitUntil = new Date(startData.waitUntil).getTime();
  const now = Date.now();
  const delayMs = Math.max(0, waitUntil - now);

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  let pricesData;
  let retryAttempt = 1;

  while (retryAttempt <= MAX_RETRIES) {
    try {
      const pricesResponse = await getSearchPrices(startData.token);
      pricesData = await pricesResponse.json();
      break;
    } catch (error) {
      const err = error as unknown as Response;
      const errorData = await err.json();

      if (errorData.code === 425) {
        const newWaitUntil = new Date(errorData.waitUntil!).getTime();
        const newDelayMs = Math.max(0, newWaitUntil - Date.now());

        if (Date.now() - startTime > SEARCH_TIMEOUT_MS) {
          throw new Error("Таймаут пошуку турів. Спробуйте пізніше.");
        }
        await new Promise((resolve) => setTimeout(resolve, newDelayMs));

        continue;
      } else if (errorData.code === 404 && retryAttempt < MAX_RETRIES) {
        retryAttempt++;
      } else {
        throw errorData;
      }
    }

    retryAttempt = 3;
  }

  if (!pricesData || !pricesData.prices) {
    return [];
  }

  const prices = Object.values(pricesData.prices);

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
