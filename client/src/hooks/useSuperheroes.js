import { useQuery } from "@tanstack/react-query";
import { api } from "../libs/api.js";

export function useSuperheroes(page) {
  return useQuery({
    queryKey: ["superheroes", page],
    queryFn: () => api.list(page, 5),
    keepPreviousData: true,
  });
}
