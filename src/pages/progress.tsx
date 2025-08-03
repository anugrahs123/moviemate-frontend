import { useNavigate, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import EpisodesPage from "../components/EpisodesPage";
import ReviewsPage from "../components/ReviewsPage";

export default function Progress() {
  const navigate = useNavigate();
  const { type } = useParams();

  return (
    <Box p={3} maxWidth={500} mx="auto">
      {type === "tv" && <EpisodesPage />}
      <ReviewsPage />

      <Button
        variant="outlined"
        fullWidth
        size="large"
        startIcon={<HomeIcon />}
        sx={{ mt: 4 }}
        onClick={() => navigate("/")}
      >
        Home Page
      </Button>
    </Box>
  );
}
