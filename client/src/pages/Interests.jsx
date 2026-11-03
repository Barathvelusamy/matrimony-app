import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Loader from "../components/Loader";

const age = (dob) =>
  dob
    ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

const TITLES = {
  received: "Interests you received",
  pending: "Waiting for your reply",
  accepted: "Accepted interests",
  sent: "Interests you sent",
};

const EMPTY = {
  received: "When someone sends you an interest, it will show here.",
  pending: "No pending interests. You are all caught up.",
  accepted: "Accepted interests will show here.",
  sent: "Search profiles and send an interest to start.",
};

export default function Interests() {
  const [view, setView] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [r, s] = await Promise.all([
        api.get("/interests/received"),
        api.get("/interests/sent"),
      ]);
      setReceived(r.data);
      setSent(s.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id, status) => {
    try {
      await api.patch(`/interests/${id}`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <Loader text="Loading interests..." />;

  const rec = received.map((i) => ({ ...i, dir: "received" }));
  const snt = sent.map((i) => ({ ...i, dir: "sent" }));
  const pendingList = rec.filter((i) => i.status === "pending");
  const acceptedList = [
    ...rec.filter((i) => i.status === "accepted"),
    ...snt.filter((i) => i.status === "accepted"),
  ];

  const lists = {
    received: rec,
    pending: pendingList,
    accepted: acceptedList,
    sent: snt,
  };
  const list = lists[view];

  const tiles = [
    ["received", "t1", rec.length, "Received"],
    ["pending", "t2", pendingList.length, "Waiting for your reply"],
    ["accepted", "t3", acceptedList.length, "Accepted"],
    ["sent", "t4", snt.length, "Sent"],
  ];

  return (
    <div className="page">
      <h2 className="page-title">Interests</h2>
      {error && <p className="error">{error}</p>}

      <div className="int-tiles">
        {tiles.map(([key, cls, count, label]) => (
          <button
            type="button"
            key={key}
            className={`int-tile ${cls} ${view === key ? "on" : ""}`}
            onClick={() => setView(key)}
          >
            <strong>{count}</strong>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <h3 className="int-list-title">
        {TITLES[view]} ({list.length})
      </h3>

      {list.length === 0 && (
        <div className="empty-state">
          <h3>Nothing here yet</h3>
          <p>{EMPTY[view]}</p>
        </div>
      )}

      <div className="int-grid">
        {list.map((i) => {
          const person = i.dir === "received" ? i.from : i.to;
          const p = i.profile;
          const years = p ? age(p.dateOfBirth) : null;

          return (
            <div className={`int-card int-${i.status}`} key={`${i.dir}-${i._id}`}>
              <div className="int-top">
                {p?.photo ? (
                  <img className="int-photo" src={p.photo} alt={person?.name} />
                ) : (
                  <div className="int-photo int-initial">
                    {person?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="int-main">
                  <h3>
                    {person?.name}
                    {years ? `, ${years}` : ""}
                  </h3>
                  {p?.city && (
                    <p className="muted">
                      {p.city}
                      {p.state ? `, ${p.state}` : ""}
                    </p>
                  )}
                  <span className={`status status-${i.status}`}>{i.status}</span>
                </div>
              </div>

              <p className="int-dir">
                {i.dir === "received" ? "Received from" : "Sent to"} {person?.name}
                {i.createdAt ? ` on ${new Date(i.createdAt).toLocaleDateString()}` : ""}
              </p>

              {p && (
                <div className="chips left">
                  {p.education && <span>{p.education}</span>}
                  {p.occupation && <span>{p.occupation}</span>}
                  {p.religion && <span>{p.religion}</span>}
                  {p.community && <span>{p.community}</span>}
                  {p.star && <span>{p.star}</span>}
                  {p.height && <span>{p.height} cm</span>}
                </div>
              )}

              {p?.about && <p className="int-about">{p.about}</p>}

              <div className="int-actions">
                <Link className="int-view" to={`/profile/${person?._id}`}>
                  View profile
                </Link>
                {i.dir === "received" && i.status === "pending" && (
                  <>
                    <button className="btn-primary" onClick={() => respond(i._id, "accepted")}>
                      Accept
                    </button>
                    <button className="btn-secondary" onClick={() => respond(i._id, "rejected")}>
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}