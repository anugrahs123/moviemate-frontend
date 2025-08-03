import { useState } from "react";
import axiosServices from "../utils/axios";
import { useNavigate } from "react-router-dom";
import type { Media } from "../types/media";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Stack,
  Snackbar,
  Alert,
  type SelectChangeEvent,
} from "@mui/material";

const initialForm: Partial<Media> = {
  title: "",
  type: "movie",
  director: "",
  genre: "",
  platform: "",
  status: "wishlist",
  totalEpisodes: undefined,
};

export default function MediaForm() {
  const [form, setForm] = useState(initialForm);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "totalEpisodes" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosServices.post("/media", form);
      setSnack({
        open: true,
        message: "Media saved successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/"), 1500); // Delay navigation to allow showing Snackbar
    } catch (error) {
      console.warn(error);
      setSnack({
        open: true,
        message: "Failed to save media.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            name="title"
            label="Title"
            value={form.title}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={form.type}
              label="Type"
              onChange={handleSelectChange}
            >
              <MenuItem value="movie">Movie</MenuItem>
              <MenuItem value="tv">TV Show</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="director"
            label="Director"
            value={form.director}
            onChange={handleInputChange}
          />
          <TextField
            name="genre"
            label="Genre"
            value={form.genre}
            onChange={handleInputChange}
          />
          <TextField
            name="platform"
            label="Platform"
            value={form.platform}
            onChange={handleInputChange}
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              onChange={handleSelectChange}
              label="Status"
            >
              <MenuItem value="watching">Watching</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="wishlist">Wishlist</MenuItem>
            </Select>
          </FormControl>

          {form.type === "tv" && (
            <TextField
              name="totalEpisodes"
              type="number"
              label="Total Episodes"
              value={form.totalEpisodes ?? ""}
              onChange={handleInputChange}
            />
          )}

          <Button variant="contained" type="submit">
            Save
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
