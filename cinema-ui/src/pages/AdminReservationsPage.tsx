import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Shows, listShowsApi } from "../api/shows.api";
import { type Reservation, listreservationsAdminApi, createReservationApi, updateReservationApi, deleteReservationApi } from "../api/reservations.api";

export default function AdminVehiculosPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [shows, setShows] = useState<Shows[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [show, setShow] = useState<number>(0);
  const [seats, setSeats] = useState(1);
  const [status, setStatus] = useState("");
  const [customerName, setcustomerName] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listreservationsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  const loadshows = async () => {
    try {
      const data = await listShowsApi();
      setShows(data.results); // DRF paginado
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadshows(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!show) return setError("Seleccione una show");
      if ( !status.trim()) return setError("status son requerido");

      const payload = {
        show: Number(shows),
        seats: Number(seats),
        status: status.trim(),
        customerName: customerName.trim(),
      };

      if (editId) await updateReservationApi(editId, payload);
      else await createReservationApi(payload as any);

      setEditId(null);
      setcustomerName("");
      setStatus("");
      setcustomerName("");
      await load();
    } catch {
      setError("No se pudo guardar tu reserva. ¿Token admin?");
    }
  };

  const startEdit = (v: Reservation) => {
    setEditId(v.id);
    setcustomerName(v.customer_name);
    setSeats(v.seats);
    setStatus(v.status);

  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar reserva. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Cinema (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="show-label">show</InputLabel>
              <Select
                labelId="show-label"
                label="show"
                value={show}
                onChange={(e) => setShow(Number(e.target.value))}
              >
                {shows.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.movie_title} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Año" type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 220 }} />
            <TextField label="customerName" value={customerName} onChange={(e) => setcustomerName(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setcustomerName(""); setStatus(""); setcustomerName(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadshows(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre de cliente</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.customer_name}</TableCell>
                <TableCell>{v.seats}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}