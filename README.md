# MovieMate

**MovieMate** is a personal movie and TV show collection tracker with support for adding media, episodes, reviews, and even AI-generated reviews using OpenAI's GPT models.

### Frontend Setup (React + Vite + Material UI)

1. Clone the github repository:

   ```git clone
   https://github.com/anugrahs123/moviemate-frontend.git

   cd moviemate-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and set API base URL:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the dev server:
   ```bash
   npm start
   ```

---

## Feature List

### ✅ Core Features

- Add and manage **Movies/TV Shows**
- Add and track **Episodes** with progress
- Rate and review on movies/shows
- **AI-Generated Reviews** using OpenAI GPT based on user notes
- Recommended movies and shows based on user rating on different genre
- Filter/sort list by genre, platform, or status
- Clean and responsive UI using Material UI

### 📚 Technical Stack

- **Frontend:** React, Vite, TypeScript, Material UI
- **Backend:** FastAPI, SQLite, OpenAI API

---
