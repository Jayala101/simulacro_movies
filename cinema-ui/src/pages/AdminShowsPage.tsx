import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Shows, listShowsApi, createShowApi, updateShowApi, deleteShowApi } from "../api/shows.api";

export default function AdminMarcasPage() {
  const [items, setItems] = useState<Shows[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [room, setRoom] = useState("");
  const [price, setPrice] = useState(0);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listShowsApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar funciones. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!movieTitle.trim()) return setError("Título de película requerido");
      if (!room.trim()) return setError("Sala requerida");
      if (price <= 0) return setError("Precio debe ser mayor a 0");
      if (availableSeats < 0) return setError("Asientos disponibles no puede ser negativo");

      const payload = {
        movie_title: movieTitle.trim(),
        room: room.trim(),
        price: Number(price),
        available_seats: Number(availableSeats)
      };

      if (editId) await updateShowApi(editId, payload);
      else await createShowApi(payload);

      setMovieTitle("");
      setRoom("");
      setPrice(0);
      setAvailableSeats(0);
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar la función. ¿Token admin?");
    }
  };

  const startEdit = (m: Shows) => {
    setEditId(m.id);
    setMovieTitle(m.movie_title);
    setRoom(m.room);
    setPrice(m.price);
    setAvailableSeats(m.available_seats);
  };

  async function remove(id: number) {
    try {
      setError("");
      await deleteShowApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar función. ¿Reservas asociadas? ¿Token admin?");
    }
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Funciones (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Título de Película" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} fullWidth />
            <TextField label="Sala" value={room} onChange={(e) => setRoom(e.target.value)} sx={{ width: 150 }} />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Precio" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} sx={{ width: 150 }} />
            <TextField label="Asientos Disponibles" type="number" value={availableSeats} onChange={(e) => setAvailableSeats(Number(e.target.value))} sx={{ width: 200 }} />
            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setMovieTitle(""); setRoom(""); setPrice(0); setAvailableSeats(0); setEditId(null); }}>Limpiar</Button>
            <Button variant="outlined" onClick={load}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Película</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.movie_title}</TableCell>
                <TableCell>{m.room}</TableCell>
                <TableCell>${m.price}</TableCell>
                <TableCell>{m.available_seats}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}