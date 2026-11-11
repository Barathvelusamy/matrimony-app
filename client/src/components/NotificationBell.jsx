import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
};

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get("/notifications");
      setItems(res.data.items);
      setUnread(res.data.unread);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      await load();
      if (unread > 0) {
        try {
          await api.post("/notifications/read-all");
          setUnread(0);
        } catch {
          /* ignore */
        }
      }
    }
  };

  const go = () => {
    setOpen(false);
    navigate("/interests");
  };

  return (
    <div className="bell" ref={boxRef}>
      <button className="bell-btn" onClick={toggle} aria-label="Notifications">
        &#128276;
        {unread > 0 && <span className="bell-badge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="bell-menu">
          <div className="bell-head">Notifications</div>
          {items.length === 0 && <p className="bell-empty">No notifications yet</p>}
          {items.map((n) => (
            <button
              key={n._id}
              className={n.read ? "bell-item" : "bell-item unread"}
              onClick={go}
            >
              <span>{n.message}</span>
              <small>{timeAgo(n.createdAt)}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}