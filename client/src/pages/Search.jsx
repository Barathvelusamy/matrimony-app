import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    <div className="card wide">
      <h2>Search Profiles</h2>
      <form
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
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <>
          <p>
            {result.total} profile(s) found. Page {result.page} of {result.pages || 1}
          </p>
          {result.profiles.map((p) => (
            <div className="profile-item" key={p._id}>
              <h3>
                {p.user?.name}, {age(p.dateOfBirth)}
              </h3>
              <p>
                {p.education}
                {p.occupation ? ` | ${p.occupation}` : ""}
              </p>
              <p>
                {p.city}
                {p.state ? `, ${p.state}` : ""}
              </p>
              {p.religion && <p>{p.religion}{p.star ? ` | ${p.star}` : ""}</p>}
              {sent[p.user._id] ? (
                <p className="success">{sent[p.user._id]}</p>
              ) : (
                <button onClick={() => sendInterest(p.user._id)}>Send Interest</button>
              )}
            </div>
          ))}
          <div className="pager">
            <button disabled={result.page <= 1} onClick={() => search(result.page - 1)}>
              Previous
            </button>
            <button disabled={result.page >= result.pages} onClick={() => search(result.page + 1)}>
              Next
            </button>
          </div>
        </>
      )}

      <button className="secondary" onClick={() => navigate("/dashboard")}>
        Back to dashboard
      </button>
    </div>
  );
}