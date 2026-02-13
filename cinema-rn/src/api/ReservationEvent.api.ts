import { http } from "./http";
import type { ReservationEvent } from "../types/reservation-events";
import type { Paginated } from "../types/drf";

export type ReservationEventCreatePayload = {
  reservation_id: number;
  event_type: string;
  source: string;
  note: string;
};

export async function listReservationEventsApi(): Promise<Paginated<ReservationEvent> | ReservationEvent[]> {
  const { data } = await http.get<Paginated<ReservationEvent> | ReservationEvent[]>("/api/reservations-services/");
  return data;
}

export async function createReservationEventApi(payload: ReservationEventCreatePayload): Promise<ReservationEvent> {
  const { data } = await http.post<ReservationEvent>("/api/reservations-services/", payload);
  return data;
}

export async function deleteReservationEventApi(id: string): Promise<void> {
  await http.delete(`/api/reservations-services/${id}/`);
}