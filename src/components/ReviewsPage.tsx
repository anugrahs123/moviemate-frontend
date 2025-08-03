import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Button, Modal, Paper } from "@mui/material";
import axios from "../utils/axios";
import type { Review } from "../types/review";
import ReviewForm from "../components/ReviewForm";

export default function ReviewsPage() {
  const { id } = useParams();
  const mediaId = Number(id);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(`/reviews/${mediaId}`).then((res) => setReviews(res.data));
  }, [mediaId]);

  return (
    <Box p={3} maxWidth={500} mx="auto">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Reviews:
      </Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews yet.</Typography>
      ) : (
        reviews.map((rev) => (
          <Paper key={rev.id} sx={{ p: 2, my: 1 }}>
            <Typography variant="subtitle2">Rating: {rev.rating}/5</Typography>
            <Typography variant="body2">{rev.review_text}</Typography>
          </Paper>
        ))
      )}
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
        + Add Review
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
          <ReviewForm
            mediaId={mediaId}
            reviews={reviews}
            setReviews={setReviews}
            onClose={() => setOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
}
