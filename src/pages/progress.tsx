import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import type { Episode } from "../types/episode";
import type { Review } from "../types/review";

export default function Progress() {
  const { id } = useParams();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [status, setStatus] = useState("watched");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    axios.get(`/episodes/${id}`).then((res) => setEpisodes(res.data));
    axios.get(`/reviews/${id}`).then((res) => setReviews(res.data));
  }, [id]);

  const handleAddEpisode = () => {
    axios
      .post("/episodes", {
        media_id: Number(id),
        season,
        episode,
        status,
      })
      .then((res) => setEpisodes((prev) => [...prev, res.data]));
  };

  const handleAddReview = () => {
    axios
      .post("/reviews", {
        media_id: Number(id),
        rating,
        review_text: reviewText,
      })
      .then((res) => {
        setReviews((prev) => [...prev, res.data]);
        setRating(0);
        setReviewText("");
      });
  };

  return (
    <div className="p-4 max-w-md">
      <h2 className="text-xl font-bold mb-4">Episode Progress</h2>

      <div className="space-y-2 mb-6">
        <input
          type="number"
          placeholder="Season"
          value={season}
          onChange={(e) => setSeason(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Episode"
          value={episode}
          onChange={(e) => setEpisode(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="watched">Watched</option>
          <option value="unwatched">Unwatched</option>
        </select>
        <button
          onClick={handleAddEpisode}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Episode
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Episodes:</h3>
        <ul className="list-disc list-inside">
          {episodes.map((ep) => (
            <li key={ep.id}>
              S{ep.season}E{ep.episode} - {ep.status}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Review</h3>
        <input
          type="number"
          min={0}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 border rounded mb-2"
          placeholder="Rating (0 to 5)"
        />
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Write your review..."
        />
        <button
          onClick={handleAddReview}
          className="w-full px-4 py-2 bg-green-600 text-white rounded"
        >
          Submit Review
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="space-y-2">
            {reviews.map((rev) => (
              <li key={rev.id} className="border p-2 rounded bg-gray-100">
                <p className="font-semibold">Rating: {rev.rating}/5</p>
                <p className="text-sm">{rev.review_text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
