import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Message from "./components/message";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const SHOWCASE = [
  { name: "Sony WH-1000XM5", cat: "Headphones", price: "₹2,990", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80" },
  { name: "Apple AirPods Pro 2", cat: "Earbuds", price: "₹2,499", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80" },
  { name: "Samsung Galaxy Tab S9", cat: "Tablet", price: "₹7,499", img: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&q=80" },
  { name: "Logitech MX Master 3S", cat: "Mouse", price: "₹999", img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80" },
];

const ACTIONS = [
  { icon: "🔍", label: "Find Products", query: "Show me the best gadgets available" },
  { icon: "⚖️", label: "Compare Prices", query: "Compare Sony headphones vs Apple AirPods" },
  { icon: "⭐", label: "Top Rated", query: "What are the highest rated products?" },
  { icon: "🎁", label: "Gift Ideas", query: "Gift ideas under ₹5000" },
];

const SUGGESTIONS = [
  "Phone under ₹20K", "Laptop for coding", "Gaming Mouse",
  "Wireless Earbuds", "Best monitor", "Smart watch",
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [opened, setOpened] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [messages, loading]);
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get(`${API_URL}/health`);
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);

    return () => clearInterval(interval);
  }, []);
  const send = async (overrideText) => {
    const text = overrideText || input;
    if (!text.trim() || loading) return;
    const newMsgs = [...messages, { sender: "user", text }];
    setMessages(newMsgs);
    if (!overrideText) setInput("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/chat`, { message: text });
      setMessages([...newMsgs, { sender: "bot", text: res.data.message, products: res.data.products }]);
    } catch {
      setMessages([...newMsgs, { sender: "bot", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const chatSend = (q) => { if (!opened) setOpened(true); setTimeout(() => send(q), 300); };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand"><span className="dot" />Aura.com</div>
        <div className="nav-right">
          <button className="theme-btn" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "🌞" : "🌜"}
          </button>
        </div>
      </nav>

      <section className="hero">
        <h1>Shop Smarter with <span className="grad">Aura Bot</span></h1>
        <p>Smart recommendations. Honest answers. A seamless shopping experience designed to help you choose with confidence.</p>
      </section>

      <div className="showcase">
        {SHOWCASE.map((s, i) => (
          <div key={i} className="show-card" onClick={() => chatSend(`Tell me about ${s.name}`)}>
            <div className="show-card-img"><img src={s.img} alt={s.name} loading="lazy" /></div>
            <div className="show-card-body">
              <div className="sc-name">{s.name}</div>
              <div className="sc-cat">{s.cat}</div>
              <div className="sc-price">{s.price}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="fab-wrap">
        <button className="fab" onClick={() => setOpened(!opened)}>
          Ask anything...
        </button>
      </div>

      <div className={`chat-backdrop ${opened ? "open" : ""}`} onClick={() => setOpened(false)} />
      <div className={`chat-panel ${opened ? "open" : ""}`}>
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div className="chat-header-info">
            <div className="ch-name">Aura Assistant</div>
            <div className={`ch-status ${isOnline ? "online" : "offline"}`}>
              <span className="status-dot"></span>
              {isOnline ? "Online" : "Offline"}
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="chat-min-btn" onClick={() => setOpened(false)}>—</button>
            <button className="chat-close" onClick={() => setOpened(false)}>✕</button>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="welcome">
            <div className="welcome-head">
              <div className="welcome-icon">👋</div>
              <h3>Welcome!</h3>
              <p>I'm your shopping assistant. How can I help?</p>
            </div>
            
            <div className="quick-actions-row">
              {ACTIONS.map((a, i) => (
                <button key={i} className="qa-btn" onClick={() => send(a.query)}>
                  <span className="qa-icon">{a.icon}</span>{a.label}
                </button>
              ))}
            </div>

            <div className="popular-searches-box">
              <div className="ps-header">
                <svg viewBox="0 0 24 24" fill="none" className="ps-icon">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Popular searches
              </div>
              <div className="ps-chips">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="ps-chip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => <Message key={i} {...m} />)}
            {loading && <Message sender="bot" animating />}
          </div>
        )}

        <div className="chat-input-wrap">
          <div className="chat-input">
            <input
              placeholder={isOnline ? "Ask about any product..." : "Assistant is offline..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              disabled={!isOnline || loading}
            />
            <button
              className="send-btn"
              onClick={() => send()}
              disabled={!isOnline || loading || !input.trim()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <div className="chat-disclaimer">
            Aura can make mistakes. Please verify details.
          </div>
        </div>
      </div>
    </>
  );
}