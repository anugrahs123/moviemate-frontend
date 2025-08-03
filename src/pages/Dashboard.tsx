import { useEffect, useState } from "react";
import axios from "../utils/axios";
import type { Media } from "../types/media";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import MediaTable from "../components/MediaTable";
export default function Dashboard() {
  const navigate = useNavigate();
  const [mediaList, setMediaList] = useState<Media[]>([]);

  useEffect(() => {
    axios.get("/media").then((res) => setMediaList(res.data));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Movie Mate
        </Typography>
        <Button variant="contained" onClick={() => navigate("/add")}>
          + Add Movie / Show
        </Button>
      </Box>
      <MediaTable mediaList={mediaList} />
    </Container>
  );
}
