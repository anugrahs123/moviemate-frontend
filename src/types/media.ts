export interface Media {
  id: number;
  title: string;
  type: "movie" | "tv";
  director: string;
  genre: string;
  platform: string;
  status: "watching" | "completed" | "wishlist";
  totalEpisodes?: number;
  episodesWatched?: number;
  rating?: number;
  review?: string;
}
