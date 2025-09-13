import { useQuery } from "@tanstack/react-query";
import { api } from "../libs/api.js";

export function useHero(id) {
  return useQuery({
    queryKey: ["hero", id],
    queryFn: () => api.get(id),
    enabled: !!id,
  });
}
