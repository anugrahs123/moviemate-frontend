import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import type { Media } from "../types/media";

interface Props {
  mediaList: Media[];
}

export default function MediaTable({ mediaList }: Props) {
  const [filterGenre, setFilterGenre] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredMedia = useMemo(() => {
    return mediaList.filter((m) => {
      return (
        (filterGenre === "" || m.genre === filterGenre) &&
        (filterPlatform === "" || m.platform === filterPlatform) &&
        (filterStatus === "" || m.status === filterStatus)
      );
    });
  }, [mediaList, filterGenre, filterPlatform, filterStatus]);

  const genres = Array.from(new Set(mediaList.map((m) => m.genre)));
  const platforms = Array.from(new Set(mediaList.map((m) => m.platform)));
  const statuses = Array.from(new Set(mediaList.map((m) => m.status)));

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            label="Genre"
          >
            <MenuItem value="">All</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            label="Platform"
          >
            <MenuItem value="">All</MenuItem>
            {platforms.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredMedia.length === 0 ? (
        <Typography variant="body2">No media found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Director</TableCell>
                <TableCell>Platform</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Episodes</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMedia.map((media) => (
                <TableRow key={media.id}>
                  <TableCell>{media.title}</TableCell>
                  <TableCell>{media.type}</TableCell>
                  <TableCell>{media.director}</TableCell>
                  <TableCell>{media.platform}</TableCell>
                  <TableCell>{media.status}</TableCell>
                  <TableCell>{media.genre}</TableCell>
                  <TableCell>
                    {media.type === "tv" ? media.totalEpisodes ?? "?" : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/progress/${media.type}/${media.id}`}
                      variant="outlined"
                      size="small"
                    >
                      Track Progress
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
