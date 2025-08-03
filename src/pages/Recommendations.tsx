import { useEffect, useState } from "react";
import axios from "../utils/axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";

interface Media {
  id: number;
  title: string;
  genre: string;
  platform: string;
}

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000); // Ensures at least 5s loading

    axios
      .get("/recommendations")
      .then((res) => setRecommendations(res.data))
      .catch(console.error);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box px={3} py={5}>
      <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
        Recommended for You
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="40vh"
        >
          <CircularProgress />
        </Box>
      ) : recommendations.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="40vh"
          textAlign="center"
          color="text.secondary"
        >
          <Typography variant="h6" gutterBottom>
            Nothing to recommend for you right now.
          </Typography>
          <Typography variant="body2">
            Once you watch and review more media, recommendations will appear
            here.
          </Typography>
        </Box>
      ) : (
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={3}
          mt={3}
        >
          {recommendations.map((item) => (
            <Card
              key={item.id}
              sx={{
                width: 280,
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Genre: {item.genre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Platform: {item.platform}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Recommendations;
