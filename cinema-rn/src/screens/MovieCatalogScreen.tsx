import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Switch } from "react-native";

import { listMovieCatalogApi, createMovieCatalogApi, deleteMovieCatalogApi } from "../api/MovieCatalog.api";
import type { MovieCatalog } from "../types/movie-catalog";
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
  return input.trim();
}

export default function MovieCatalogScreen() {
  const [items, setItems] = useState<MovieCatalog[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [rating, setRating] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listMovieCatalogApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar catálogo. ¿Login? ¿Token?");
    }
  };

  useEffect(() => { load(); }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const cleanMovieTitle = normalizeText(movieTitle);
      if (!cleanMovieTitle) return setErrorMessage("Movie title es requerido");

      const cleanGenre = normalizeText(genre);
      if (!cleanGenre) return setErrorMessage("Genre es requerido");

      const duration = parseInt(durationMin.trim(), 10);
      if (!duration || isNaN(duration) || duration <= 0) {
        return setErrorMessage("Duration debe ser un número positivo");
      }

      const cleanRating = normalizeText(rating);
      if (!cleanRating) return setErrorMessage("Rating es requerido");

      const created = await createMovieCatalogApi({
        movie_title: cleanMovieTitle,
        genre: cleanGenre,
        duration_min: duration,
        rating: cleanRating,
        is_active: isActive,
      });

      setItems((prev) => [created, ...prev]);
      setMovieTitle("");
      setGenre("");
      setDurationMin("");
      setRating("");
      setIsActive(true);
    } catch {
      setErrorMessage("No se pudo crear película.");
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteMovieCatalogApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar película.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Catalog</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Movie Title</Text>
      <TextInput
        value={movieTitle}
        onChangeText={setMovieTitle}
        placeholder="Inception, The Matrix, etc."
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Genre</Text>
      <TextInput
        value={genre}
        onChangeText={setGenre}
        placeholder="Action, Sci-Fi, Drama, etc."
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Duration (minutes)</Text>
      <TextInput
        value={durationMin}
        onChangeText={setDurationMin}
        placeholder="120"
        placeholderTextColor="#8b949e"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Rating</Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        placeholder="PG-13, R, PG, etc."
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Is Active</Text>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          trackColor={{ false: "#767577", true: "#58a6ff" }}
          thumbColor={isActive ? "#fff" : "#f4f3f4"}
        />
      </View>

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
              <Text style={styles.rowText} numberOfLines={1}>{item.movie_title}</Text>
              <Text style={styles.rowSub} numberOfLines={1}>
                {item.genre} • {item.duration_min}
              </Text>
              {!item.is_active && <Text style={styles.inactiveText}>INACTIVE</Text>}
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 10 },
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
  rowSub: { color: "#8b949e", marginTop: 2, fontSize: 12 },
  inactiveText: { color: "#ff7b72", marginTop: 2, fontSize: 10, fontWeight: "700" },
  del: { color: "#ff7b72", fontWeight: "700" },
});