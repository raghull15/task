<img width="1365" height="598" alt="Image" src="https://github.com/user-attachments/assets/5c87e116-a6e7-490f-bea2-d296201036e5" />
<img width="1365" height="599" alt="Image" src="https://github.com/user-attachments/assets/d6e0e6da-1ae0-4c71-bc3c-db9bcdfaf053" />
# Aura.com — AI Product Shopping Assistant

Aura.com is a full-stack AI-powered shopping assistant that helps users search, discover, and compare products through a conversational interface.

## Tech Stack

### Frontend
- React (Vite)
- Axios
- CSS

### Backend
- FastAPI
- Python
- Google Gemini API
- JSON Dataset

---

## Project Structure

```
task/
├── backend/
│   ├── main.py
│   ├── search.py
│   ├── products.json
│   ├── pyproject.toml
│   └── ...
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── ...
```

---

# Backend Setup

### 1. Navigate to the backend

```bash
cd backend
```

### 2. Create a virtual environment

**Windows**

```bash
python -m venv .venv
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install fastapi uvicorn python-dotenv google-genai
```

### 4. Create a `.env` file inside the `backend` folder

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

> **Note:** The API key is not included in this repository. Generate your own Gemini API key and add it to the `.env` file.

### 5. Start the backend

```bash
uvicorn main:app --reload
```

The backend runs at:

```
http://127.0.0.1:8000
```

---

# Frontend Setup

### 1. Navigate to the frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## Features

- AI-powered shopping assistant
- Product search and recommendations
- Product comparison
- JSON-based product catalog
- Responsive React interface
- FastAPI backend
- Google Gemini AI integration

---

## Notes

- The Gemini API key is **not included** in this repository.
- Create your own `backend/.env` file before running the project.
- The backend must be running before starting the frontend.
- By default, the frontend communicates with the backend at `http://127.0.0.1:8000`.

---

## Author

Developed as an AI Product Shopping Assistant demonstration project.
