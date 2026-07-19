from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ChatRequest
from search import search_products

app = FastAPI(title="Aura.com", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Aura.com API running"}

@app.get("/health")
def health():
    return {"status": "online"}

@app.post("/chat")
def chat(req: ChatRequest):
    return search_products(req.message)