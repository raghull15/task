import ProductCards from "./productcards";

function formatText(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*([\s\S]*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

export default function Message({ sender, text, products, animating }) {
  if (animating) {
    return (
      <div className="typing">
        <div className="wave"><span /><span /><span /><span /><span /></div>
        <span className="typing-label">Aura is thinking...</span>
      </div>
    );
  }

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {text && (
        <div className={`msg-wrapper ${sender}`}>
          {sender === "bot" && <div className="msg-avatar">🤖</div>}
          <div className="msg-bubble-container">
            <div className={`msg ${sender}`}>
              <div className="msg-content">{formatText(text)}</div>
              {sender === "bot" && <span className="msg-time">{timeStr}</span>}
            </div>
            {sender === "user" && (
              <div className="msg-status">
                {timeStr} <span className="status-check">✓✓</span>
              </div>
            )}
          </div>
        </div>
      )}
      {products?.length > 0 && (
        <div className="device-scroll">
          {products.map(p => <ProductCards key={p.id} product={p} />)}
        </div>
      )}
    </>
  );
}