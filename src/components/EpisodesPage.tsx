import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import axios from "../utils/axios";
import type { Episode } from "../types/episode";
import EpisodeProgressForm from "../components/EpisodeProgressForm";

export default function EpisodesPage() {
  const { id } = useParams();
  const mediaId = Number(id);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(`/episodes/${mediaId}`).then((res) => setEpisodes(res.data));
  }, [mediaId]);

  return (
    <Box p={3} maxWidth={500} mx="auto">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Episodes:
      </Typography>
      {episodes.map((ep) => (
        <Typography key={ep.id}>
          S{ep.season}E{ep.episode} - {ep.status}
        </Typography>
      ))}
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
        + Add Episode
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 3,
            bgcolor: "background.paper",
            maxWidth: 400,
            mx: "auto",
            mt: 10,
            borderRadius: 2,
          }}
        >
          <EpisodeProgressForm
            mediaId={mediaId}
            episodes={episodes}
            setEpisodes={setEpisodes}
            onClose={() => setOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
}
