import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import EpisodesPage from "../components/EpisodesPage";
import ReviewsPage from "../components/ReviewsPage";

export default function Progress() {
  const { type } = useParams();

  return (
    <Box p={3} maxWidth={500} mx="auto">
      {type === "tv" && <EpisodesPage />}
      <ReviewsPage />
    </Box>
  );
}
