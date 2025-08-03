import { useEffect, useState } from "react";
import axios from "../utils/axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Media {
  id: number;
  title: string;
  genre: string;
  platform: string;
}

const Recommendations = () => {
  const navigate = useNavigate();
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
          <Box display="flex" justifyContent="center" mt={5}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{ width: 300 }}
            >
              Home Page
            </Button>
          </Box>
        </Box>
      ) : (
        <>
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

          <Box display="flex" justifyContent="center" mt={5}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{ width: 300 }}
            >
              Home Page
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Recommendations;
