import { useEffect, useState } from "react";
import axios from "../utils/axios";
import type { Media } from "../types/media";

import MediaCard from "../components/MediaCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [mediaList, setMediaList] = useState<Media[]>([]);
  useEffect(() => {
    axios.get("/media").then((res) => setMediaList(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">My Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mediaList.map((media) => (
          <MediaCard key={media.id} media={media} />
        ))}
      </div>
      <button onClick={() => navigate("/add")}>+ Add Movie / Show</button>
    </div>
  );
}
