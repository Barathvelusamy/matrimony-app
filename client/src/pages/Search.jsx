import { useState } from "react";
import api from "../api";

const age = (dob) =>
  Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));

export default function Search() {
  const [filters, setFilters] = useState({
    gender: "",
    minAge: "",
    maxAge: "",
    city: "",
    education: "",
    religion: "",
  });
  const [result, setResult] = useState(null);
  const [sent, setSent] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const search = async (page = 1) => {
    setError("");
    try {
      const params = { page };
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get("/profile/search", { params });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const sendInterest = async (userId) => {
    try {
      await api.post(`/interests/send/${userId}`);
      setSent({ ...sent, [userId]: "Interest sent" });
    } catch (err) {
      setSent({
        ...sent,
        [userId]: err.response?.data?.message || "Failed",
      });
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">Search Profiles</h2>

      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          search(1);
        }}
      >
        <select name="gender" value={filters.gender} onChange={handleChange}>
          <option value="">Any gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input name="minAge" type="number" placeholder="Min age" value={filters.minAge} onChange={handleChange} />
        <input name="maxAge" type="number" placeholder="Max age" value={filters.maxAge} onChange={handleChange} />
        <input name="city" placeholder="City" value={filters.city} onChange={handleChange} />
        <input name="education" placeholder="Education" value={filters.education} onChange={handleChange} />
        <input name="religion" placeholder="Religion" value={filters.religion} onChange={handleChange} />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <>
          <p className="result-count">
            {result.total} profile(s) found. Page {result.page} of {result.pages || 1}
          </p>

          <div className="profile-grid">
            {result.profiles.map((p) => (
              <div className="profile-card" key={p._id}>
                <div className="avatar">
                  {p.user?.name?.charAt(0).toUpperCase()}
                </div>
                <h3>
                  {p.user?.name}, {age(p.dateOfBirth)}
                </h3>
                <p className="muted">
                  {p.city}
                  {p.state ? `, ${p.state}` : ""}
                </p>
                <div className="chips">
                  {p.education && <span>{p.education}</span>}
                  {p.occupation && <span>{p.occupation}</span>}
                  {p.religion && <span>{p.religion}</span>}
                  {p.star && <span>{p.star}</span>}
                  {p.height && <span>{p.height} cm</span>}
                </div>
                {p.about && <p className="about">{p.about}</p>}
                {sent[p.user._id] ? (
                  <p className="success">{sent[p.user._id]}</p>
                ) : (
                  <button className="btn-primary" onClick={() => sendInterest(p.user._id)}>
                    Send Interest
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pagination">
            <button className="btn-secondary" disabled={result.page <= 1} onClick={() => search(result.page - 1)}>
              Previous
            </button>
            <button className="btn-secondary" disabled={result.page >= result.pages} onClick={() => search(result.page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}