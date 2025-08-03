import MediaForm from "../components/MediaForm";
import { Container, Typography } from "@mui/material";

export default function AddMedia() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add Movie or TV Show
      </Typography>
      <MediaForm />
    </Container>
  );
}
