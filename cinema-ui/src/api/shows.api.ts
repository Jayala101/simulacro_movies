import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Shows = {
    id: number;
    movie_title: string;
    room: string;
    price: number;
    available_seats: number;
  
  };


export async function listShowsApi() {
  const { data } = await http.get<Paginated<Shows>>("/api/shows/");
  return data; // { count, next, previous, results }
}

export async function createShowApi(payload: Omit<Shows, "id">) {
  const { data } = await http.post<Shows>("/api/shows/", payload);
  return data;
}

export async function updateShowApi(id: number, payload: Partial<Omit<Shows, "id">>) {
  const { data } = await http.patch<Shows>(`/api/shows/${id}/`, payload);
  return data;
}

export async function deleteShowApi(id: number) {
  await http.delete(`/api/shows/${id}/`);
}