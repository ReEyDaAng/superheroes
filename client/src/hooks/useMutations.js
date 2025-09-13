import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../libs/api.js";
export function useCreateHero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["superheroes"] }),
  });
}
export function useUpdateHero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["superheroes"] });
      qc.invalidateQueries({ queryKey: ["hero", vars.id] });
    },
  });
}
export function useDeleteHero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["superheroes"] }),
  });
}
export function useUploadImage() {
  return useMutation({
    mutationFn: ({ file, heroId }) => api.upload(file, heroId),
  });
}
