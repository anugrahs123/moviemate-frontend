import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import axios from "../utils/axios";
import type { Episode } from "../types/episode";

interface Props {
  mediaId: number;
  episodes: Episode[];
  setEpisodes: (episodes: Episode[]) => void;
  onClose?: () => void;
}

export default function EpisodeProgressForm({
  mediaId,
  episodes,
  setEpisodes,
  onClose,
}: Props) {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [status, setStatus] = useState("watched");
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatus(e.target.value);
  };

  const resetForm = () => {
    setSeason(1);
    setEpisode(1);
    setStatus("watched");
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = () => {
    const duplicate = episodes.some(
      (ep) =>
        ep.season === season &&
        ep.episode === episode &&
        (!isEditing || ep.id !== editId)
    );

    if (duplicate) {
      setError("This episode details already recorded.");
      return;
    }

    const payload = { media_id: mediaId, season, episode, status };

    if (isEditing && editId !== null) {
      axios
        .put(`/episodes/${editId}`, payload)
        .then((res) => {
          const updatedList = episodes.map((ep) =>
            ep.id === editId ? res.data : ep
          );
          setEpisodes(updatedList);
          resetForm();
          onClose?.();
        })
        .catch(() => setError("Failed to update episode."));
    } else {
      axios
        .post("/episodes", payload)
        .then((res) => {
          setEpisodes([...episodes, res.data]);
          resetForm();
          onClose?.();
        })
        .catch(() => setError("Failed to add episode."));
    }
  };

  const handleEditClick = (ep: Episode) => {
    setSeason(ep.season);
    setEpisode(ep.episode);
    setStatus(ep.status);
    setIsEditing(true);
    setEditId(ep.id);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          type="number"
          label="Season"
          value={season}
          onChange={(e) => setSeason(Number(e.target.value))}
          inputProps={{ min: 1 }}
          fullWidth
        />
        <TextField
          type="number"
          label="Episode"
          value={episode}
          onChange={(e) => setEpisode(Number(e.target.value))}
          inputProps={{ min: 1 }}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={handleStatusChange}>
            <MenuItem value="watched">Watched</MenuItem>
            <MenuItem value="unwatched">Unwatched</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={handleSubmit}>
            {isEditing ? "Update" : "Add Episode"}
          </Button>
          {isEditing && (
            <Button variant="outlined" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      {/* Optional: show edit buttons below */}
      <Box mt={4}>
        {episodes.map(
          (ep) =>
            ep.status === "unwatched" && (
              <Box
                key={ep.id}
                display="flex"
                justifyContent="space-between"
                mt={1}
              >
                <div>
                  Season {ep.season}, Episode {ep.episode} – {ep.status}
                </div>
                <Button size="small" onClick={() => handleEditClick(ep)}>
                  Edit
                </Button>
              </Box>
            )
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
