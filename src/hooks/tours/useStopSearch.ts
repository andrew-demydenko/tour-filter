import { useMutation } from "@tanstack/react-query";
import { stopSearchPrices } from "@/services/api";
import { useTourSearchStore } from "@/stores/useTourSearchStore";

export const useStopSearch = ({ onSuccess }: { onSuccess?: () => void }) => {
  const setSearchToken = useTourSearchStore((state) => state.setSearchToken);
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
