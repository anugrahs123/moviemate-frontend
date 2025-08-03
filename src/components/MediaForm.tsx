import { useState } from "react";
import axiosServices from "../utils/axios";
import { useNavigate } from "react-router-dom";
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

export default function MediaForm() {
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "totalEpisodes" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axiosServices.post("/media", form);
    navigate("/"); // Go back to dashboard
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className="border p-2"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2"
      >
        <option value="movie">Movie</option>
        <option value="tv">TV Show</option>
      </select>

      <input
        name="director"
        placeholder="Director"
        value={form.director}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="genre"
        placeholder="Genre"
        value={form.genre}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="platform"
        placeholder="Platform"
        value={form.platform}
        onChange={handleChange}
        className="border p-2"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border p-2"
      >
        <option value="watching">Watching</option>
        <option value="completed">Completed</option>
        <option value="wishlist">Wishlist</option>
      </select>

      {form.type === "tv" && (
        <input
          name="totalEpisodes"
          type="number"
          placeholder="Total Episodes"
          value={form.totalEpisodes ?? ""}
          onChange={handleChange}
          className="border p-2"
        />
      )}

      <button type="submit" className="bg-blue-600 text-white py-2 rounded">
        Save
      </button>
    </form>
  );
}
