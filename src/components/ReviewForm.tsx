import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import axios from "../utils/axios";
import type { Review } from "../types/review";

interface Props {
  mediaId: number;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  onClose?: () => void;
}

export default function ReviewForm({
  mediaId,
  reviews,
  setReviews,
  onClose,
}: Props) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    axios
      .post("/reviews", {
        media_id: mediaId,
        rating,
        review_text: reviewText,
      })
      .then((res) => {
        setReviews([...reviews, res.data]);
        setRating(0);
        setReviewText("");
        onClose?.();
      });
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        type="number"
        label="Rating (0-5)"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        inputProps={{ min: 0, max: 5 }}
        fullWidth
      />
      <TextField
        label="Review"
        multiline
        rows={3}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="success" onClick={handleSubmit}>
        Submit Review
      </Button>
    </Box>
  );
}
