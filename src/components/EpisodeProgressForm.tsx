import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatus(e.target.value);
  };

  const handleSubmit = () => {
    axios
      .post("/episodes", {
        media_id: mediaId,
        season,
        episode,
        status,
      })
      .then((res) => {
        setEpisodes([...episodes, res.data]);
        onClose?.();
      });
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        type="number"
        label="Season"
        value={season}
        onChange={(e) => setSeason(Number(e.target.value))}
        fullWidth
      />
      <TextField
        type="number"
        label="Episode"
        value={episode}
        onChange={(e) => setEpisode(Number(e.target.value))}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select value={status} label="Status" onChange={handleStatusChange}>
          <MenuItem value="watched">Watched</MenuItem>
          <MenuItem value="unwatched">Unwatched</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSubmit}>
        Add Episode
      </Button>
    </Box>
  );
}
