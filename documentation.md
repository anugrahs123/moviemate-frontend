# MovieMate – Project Documentation

## Overview

MovieMate is a personal movie and TV show tracking application designed for users who want to manage and review their watched and planned media efficiently. It supports reviewing, rating, and tracking progress across episodes and seasons. The application is built with a React (Vite + MUI) frontend and FastAPI backend using SQLite.

## Tech Stack

### Frontend

- React with Vite
- TypeScript
- Material UI (MUI)
- Axios, React Router DOM

### Backend

- FastAPI (Python)
- SQLite (via SQLAlchemy ORM)
- Pydantic for data validation
- OpenAI integration for AI-generated reviews

## Folder Structure

### Frontend (`/frontend`)

```
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── main.tsx
├── index.html
└── vite.config.ts
```

### Backend (`/backend`)

```
├── app/
│   ├── models/
│   ├── routes/
│   ├── database.py
│   └── main.py
├── .env
└── requirements.txt
```

## Key Features

### Frontend

- Dashboard to display user media
- Modal-driven form for adding reviews and tracking episodes
- Integrated routing using React Router
- Material UI styled components

### Backend

- FastAPI RESTful endpoints for:
  - Media CRUD
  - Episode tracking
  - Review & rating submission
  - AI-generated reviews via OpenAI
- SQLite database
- `.env` support for secrets

## API Endpoints

```
POST   /media/               # Add new media
GET    /media/               # List media
POST   /episodes/            # Add watched episode info
POST   /reviews/             # Add a review manually
POST   /generate-review/     # Auto-generate review using AI
```

## Environment Variables

Ensure the following variables are defined in your `.env` file:

```
OPENAI_API_KEY=your_openai_key
DATABASE_URL=sqlite:///./moviemate.db
```

## Deployment

The application is deployed using Railway and Vercel.

1. Configure environment variables on the platform.
2. Connect to a GitHub repo.
3. Ensure correct start command for backend: `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

## Contributors

- Anugrah S
