import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";

import { listReservationEventsApi, createReservationEventApi, deleteReservationEventApi } from "../api/ReservationEvent.api";
import type { ReservationEvent } from "../types/reservation-events";
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
  return input.trim();
}

export default function ReservationEventsScreen() {
  const [items, setItems] = useState<ReservationEvent[]>([]);
  const [reservationId, setReservationId] = useState("");
  const [eventType, setEventType] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listReservationEventsApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar eventos. ¿Login? ¿Token?");
    }
  };

  useEffect(() => { load(); }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const resId = parseInt(reservationId.trim(), 10);
      if (!resId || isNaN(resId)) return setErrorMessage("Reservation ID es requerido");
      if (!eventType.trim()) return setErrorMessage("Event Type es requerido");
      if (!source.trim()) return setErrorMessage("Source es requerido");

      const created = await createReservationEventApi({
        reservation_id: resId,
        event_type: normalizeText(eventType),
        source: normalizeText(source),
        note: normalizeText(note),
      });

      setItems((prev) => [created, ...prev]);
      setReservationId("");
      setEventType("");
      setSource("");
      setNote("");
    } catch {
      setErrorMessage("No se pudo crear evento.");
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteReservationEventApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar evento.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation Events</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Reservation ID</Text>
      <TextInput
        value={reservationId}
        onChangeText={setReservationId}
        placeholder="1"
        placeholderTextColor="#8b949e"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Event Type</Text>
      <TextInput
        value={eventType}
        onChangeText={setEventType}
        placeholder="confirmed, cancelled, etc."
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Source</Text>
      <TextInput
        value={source}
        onChangeText={setSource}
        placeholder="web_app, mobile_app, etc."
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Note (opcional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Additional notes..."
        placeholderTextColor="#8b949e"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Pressable onPress={createItem} style={styles.btn}>
        <Text style={styles.btnText}>Crear</Text>
      </Pressable>

      <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>Res #{item.reservation_id} - {item.event_type}</Text>
              <Text style={styles.rowSub} numberOfLines={1}>Source: {item.source}</Text>
              {!!item.note && <Text style={styles.rowSub} numberOfLines={2}>{item.note}</Text>}
            </View>

            <Pressable onPress={() => removeItem(item.id)}>
              <Text style={styles.del}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "700" },
});