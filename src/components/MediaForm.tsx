import { useState } from "react";
import axiosServices from "../utils/axios";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
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
  CircularProgress,
  type SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import type { Media } from "../types/media";

const initialForm: Partial<Media> = {
  title: "",
  type: "movie",
  director: "",
  genre: "",
  platform: "",
  status: "wishlist",
  totalEpisodes: undefined,
};

const schema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Please enter the title to proceed.",
  }),
  type: Joi.string().valid("movie", "tv").required(),
  director: Joi.string().required().messages({
    "string.empty": "Please enter the director to proceed.",
  }),
  genre: Joi.string().required().messages({
    "string.empty": "Please enter the genre to proceed.",
  }),
  platform: Joi.string().required().messages({
    "string.empty": "Please enter the platform to proceed.",
  }),
  status: Joi.string().valid("watching", "completed", "wishlist").required(),
  totalEpisodes: Joi.when("type", {
    is: "tv",
    then: Joi.number().min(1).required().messages({
      "number.base": "Please enter a valid episode number.",
      "number.min": "Episode count must be at least 1.",
      "any.required": "Please enter total episodes to proceed.",
    }),
    otherwise: Joi.optional(),
  }),
});

export default function MediaForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const { error } = schema.validate(form, { abortEarly: false });
    if (!error) {
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    for (const detail of error.details) {
      const path = detail.path[0] as string;
      newErrors[path] = detail.message;
    }
    setErrors(newErrors);
    return false;
  };

  const validateField = (name: string, value: string | number) => {
    const fieldSchema = schema.extract(name);
    const { error } = fieldSchema.validate(value);
    setErrors((prev) => ({
      ...prev,
      [name]: error?.message || "",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "totalEpisodes" ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      await axiosServices.post("/media", form);
      setSnack({
        open: true,
        message: "Media saved successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.warn(error);
      setSnack({
        open: true,
        message: "Failed to save media.",
        severity: "error",
      });
    } finally {
      setLoading(false);
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
            onBlur={handleBlur}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
          />

          <FormControl fullWidth error={!!errors.type}>
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
            {!!errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>

          <TextField
            name="director"
            label="Director"
            value={form.director}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.director}
            helperText={errors.director}
          />

          <FormControl fullWidth error={!!errors.genre}>
            <InputLabel>Genre</InputLabel>
            <Select
              name="genre"
              value={form.genre}
              label="Type"
              onChange={handleSelectChange}
            >
              <MenuItem value="Action">Action</MenuItem>
              <MenuItem value="Comedy">Comedy</MenuItem>
              <MenuItem value="Fantasy">Fantasy</MenuItem>
              <MenuItem value="Horror">Horror</MenuItem>
              <MenuItem value="Romance">Romance</MenuItem>
              <MenuItem value="Thriller">Thriller</MenuItem>
            </Select>
            {!!errors.genre && <FormHelperText>{errors.genre}</FormHelperText>}
          </FormControl>
          <TextField
            name="platform"
            label="Platform"
            value={form.platform}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!errors.platform}
            helperText={errors.platform}
          />

          <FormControl fullWidth error={!!errors.status}>
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
            {!!errors.status && (
              <FormHelperText>{errors.status}</FormHelperText>
            )}
          </FormControl>

          {form.type === "tv" && (
            <TextField
              name="totalEpisodes"
              type="number"
              label="Total Episodes"
              value={form.totalEpisodes ?? ""}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={!!errors.totalEpisodes}
              helperText={errors.totalEpisodes}
            />
          )}

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Saving..." : "Save"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
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
