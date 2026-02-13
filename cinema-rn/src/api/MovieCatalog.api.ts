import { http } from "./http";
import type { MovieCatalog } from "../types/movie-catalog";
import type { Paginated } from "../types/drf";

export async function listMovieCatalogApi(): Promise<Paginated<MovieCatalog> | MovieCatalog[]> {
  const { data } = await http.get<Paginated<MovieCatalog> | MovieCatalog[]>("/api/movie-types/");
  return data;
}

export async function createMovieCatalogApi(payload: Pick<MovieCatalog, "movie_title"> & Partial<MovieCatalog>): Promise<MovieCatalog> {
  const { data } = await http.post<MovieCatalog>("/api/movie-types/", payload);
  return data;
}

export async function deleteMovieCatalogApi(id: string): Promise<void> {
  await http.delete(`/api/movie-types/${id}/`);
}