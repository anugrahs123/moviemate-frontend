import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AutoFixHigh } from "@mui/icons-material";
import axios from "../utils/axios";
import Joi from "joi";
import type { Review } from "../types/review";
import type { Media } from "../types/media";

interface Props {
  mediaId: number;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  onClose?: () => void;
}

const schema = Joi.object({
  rating: Joi.number().min(0).max(5).required().messages({
    "number.base": "Please enter rating to proceed.",
    "number.empty": "Please enter rating to proceed.",
    "number.min": "Rating must be at least 0.",
    "number.max": "Rating must not exceed 5.",
    "any.required": "Rating is required.",
  }),
  reviewText: Joi.string().min(10).max(500).required().messages({
    "string.empty": "Please enter review to proceed.",
    "string.min": "Review must be at least 10 characters.",
    "string.max": "Review must not exceed 500 characters.",
    "any.required": "Please enter review to proceed.",
  }),
});

export default function ReviewForm({
  mediaId,
  reviews,
  setReviews,
  onClose,
}: Props) {
  const [rating, setRating] = useState<number | "">("");
  const [reviewText, setReviewText] = useState("");
  const [errors, setErrors] = useState<{
    rating?: string;
    reviewText?: string;
  }>({});
  const [loadingAI, setLoadingAI] = useState(false);
  const [mediaList, setMediaList] = useState<Media[]>([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    axios.get("/media").then((res) => setMediaList(res.data));
  }, []);

  const handleSubmit = () => {
    const { error } = schema.validate(
      { rating, reviewText },
      { abortEarly: false }
    );

    if (error) {
      const newErrors: typeof errors = {};
      error.details.forEach((detail) => {
        const field = detail.path[0] as keyof typeof errors;
        newErrors[field] = detail.message;
      });
      setErrors(newErrors);
      return;
    }

    axios
      .post("/reviews", {
        media_id: mediaId,
        rating,
        review_text: reviewText,
      })
      .then((res) => {
        setReviews([...reviews, res.data]);
        setRating("");
        setReviewText("");
        setErrors({});
        onClose?.();
      });
  };

  const handleAIReview = async () => {
    setLoadingAI(true);
    try {
      const media = mediaList.find((m) => m.id === mediaId);
      const res = await axios.post("/generate-review", { reviewText, media });
      setReviewText(res.data.review);
    } catch (err: unknown) {
      console.error("AI review failed", err);
      setSnackbarMessage(
        // "AI quota exceeded. Please check your OpenAI billing."
        "Something went wrong while generating the review."
      );
      setSnackbarOpen(true);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        type="number"
        label="Rating (0–5)"
        value={rating}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val <= 5 && val >= 0) setRating(val);
          else if (e.target.value === "") setRating("");
        }}
        onBlur={() => {
          const { error } = schema.validate(
            { rating, reviewText },
            { abortEarly: false }
          );
          const newErrors: typeof errors = {};
          error?.details.forEach((detail) => {
            const field = detail.path[0] as keyof typeof errors;
            if (field === "rating") newErrors[field] = detail.message;
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
        }}
        error={!!errors.rating}
        helperText={errors.rating}
        inputProps={{ min: 0, max: 5 }}
        fullWidth
        required
      />

      <TextField
        label="Review"
        multiline
        rows={3}
        value={reviewText}
        onChange={(e) => {
          setReviewText(e.target.value);
          if (errors.reviewText) {
            setErrors((prev) => ({ ...prev, reviewText: undefined }));
          }
        }}
        onBlur={() => {
          const { error } = schema.validate(
            { rating, reviewText },
            { abortEarly: false }
          );
          const newErrors: typeof errors = {};
          error?.details.forEach((detail) => {
            const field = detail.path[0] as keyof typeof errors;
            if (field === "reviewText") newErrors[field] = detail.message;
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
        }}
        error={!!errors.reviewText}
        helperText={errors.reviewText}
        inputProps={{ minLength: 10, maxLength: 500 }}
        fullWidth
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <LoadingButton
                size="small"
                onClick={handleAIReview}
                loading={loadingAI}
                variant="outlined"
              >
                <AutoFixHigh />
              </LoadingButton>
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={loadingAI}
        >
          Submit Review
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
