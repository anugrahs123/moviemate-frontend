import { useEffect, useState } from "react";
import axios from "../utils/axios";
import type { Media } from "../types/media";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box, Stack } from "@mui/material";
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
        <Typography variant="h4" component="h1" fontWeight={600}>
          Movie Mate
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/add")}
          >
            + Add Movie / Show
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/recommendations")}
          >
            Recommendations
          </Button>
        </Stack>
      </Box>

      <MediaTable mediaList={mediaList} />
    </Container>
  );
}
