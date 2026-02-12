import { useMutation } from "@tanstack/react-query";
import { stopSearchPrices } from "../services/api";
import { setSearchToken } from "../stores/searchTokenStore";

export const useStopSearch = ({ onSuccess }: { onSuccess?: () => void }) => {
  const mutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await stopSearchPrices(token);
      return response;
    },
    onSuccess: () => {
      setSearchToken(null);
      onSuccess?.();
    },
  });

  return {
    stopSearch: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
