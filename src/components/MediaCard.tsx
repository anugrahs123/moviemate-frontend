import { Link, useNavigate } from "react-router-dom";
import type { Media } from "../types/media";

interface Props {
  media: Media;
}

export default function MediaCard({ media }: Props) {
  const navigate = useNavigate();
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition"  onClick={() => navigate(`/progress/${media.id}`)}>
      <h2 className="text-xl font-bold">{media.title}</h2>
      <p className="text-sm text-gray-600">{`${
        media.type ? media.type?.toUpperCase() : media.genre
      }`}</p>
      <p className="text-sm">Platform: {media.platform}</p>
      <p className="text-sm">Status: {media.status}</p>

      {media.type === "tv" && (
        <p className="text-sm">
          {media.episodesWatched ?? 0} / {media.totalEpisodes ?? "?"} episodes
          watched
        </p>
      )}

      <div className="mt-4 flex gap-2">
        {media.type === "tv" && (
          <Link
            to={`/progress/${media.id}`}
            className="text-blue-600 underline text-sm"
          >
            Track Progress
          </Link>
        )}
      </div>
    </div>
  );
}
