import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const age = (dob) =>
  dob
    ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

const emptyFilters = {
  gender: "",
  minAge: "",
  maxAge: "",
  city: "",
  education: "",
  religion: "",
};

export default function Search() {
  const [filters, setFilters] = useState(emptyFilters);
  const [result, setResult] = useState(null);
  const [sent, setSent] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const search = async (page = 1, f = filters) => {
    setError("");
    setLoading(true);
    try {
      const params = { page };
      Object.entries(f).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await api.get("/profile/search", { params });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setResult(null);
    setError("");
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
    <div className="sr">
      <div className="sr-hero">
        <h2>Find your perfect match</h2>
        <p>Filter by age, place, education and more to meet the right people.</p>
      </div>

      <form
        className="sr-filters"
        onSubmit={(e) => {
          e.preventDefault();
          search(1);
        }}
      >
        <div className="sr-gender">
          {[
            ["", "Any"],
            ["male", "Male"],
            ["female", "Female"],
          ].map(([val, label]) => (
            <button
              type="button"
              key={label}
              className={filters.gender === val ? "sr-chip active" : "sr-chip"}
              onClick={() => setFilters({ ...filters, gender: val })}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sr-fields">
          <input name="minAge" type="number" placeholder="🎂 Min age" value={filters.minAge} onChange={handleChange} />
          <input name="maxAge" type="number" placeholder="🎂 Max age" value={filters.maxAge} onChange={handleChange} />
          <input name="city" placeholder="📍 City" value={filters.city} onChange={handleChange} />
          <input name="education" placeholder="🎓 Education" value={filters.education} onChange={handleChange} />
          <input name="religion" placeholder="🕉️ Religion" value={filters.religion} onChange={handleChange} />
        </div>

        <div className="sr-buttons">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
          <button type="button" className="btn-secondary" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {loading && (
        <div className="sr-grid">
          {[1, 2, 3].map((n) => (
            <div className="sr-card sr-skeleton" key={n} />
          ))}
        </div>
      )}

      {!loading && !result && !error && (
        <div className="empty-state">
          <h3>Find your match</h3>
          <p>Choose filters above and click Search. Leave them empty to see everyone.</p>
        </div>
      )}

      {!loading && result && result.profiles.length === 0 && (
        <div className="empty-state">
          <h3>No profiles found</h3>
          <p>Try removing a filter or widening the age range.</p>
        </div>
      )}

      {!loading && result && result.profiles.length > 0 && (
        <>
          <p className="sr-count">
            <strong>{result.total}</strong> profile(s) found. Page {result.page} of {result.pages || 1}
          </p>

          <div className="sr-grid">
            {result.profiles.map((p) => {
              const years = age(p.dateOfBirth);
              return (
                <div className="sr-card" key={p._id}>
                  <div className="sr-cover">
                    {p.photo ? (
                      <img className="sr-photo" src={p.photo} alt={p.user?.name} />
                    ) : (
                      <div className="sr-photo sr-initial">
                        {p.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="sr-body">
                    <h3>
                      {p.user?.name}
                      {years ? `, ${years}` : ""}
                    </h3>
                    <p className="muted">
                      📍 {p.city}
                      {p.state ? `, ${p.state}` : ""}
                    </p>

                    <div className="chips">
                      {p.education && <span>{p.education}</span>}
                      {p.occupation && <span>{p.occupation}</span>}
                      {p.religion && <span>{p.religion}</span>}
                      {p.star && <span>{p.star}</span>}
                      {p.height && <span>{p.height} cm</span>}
                    </div>

                    {p.about && <p className="sr-about">{p.about}</p>}

                    <div className="sr-actions">
                      <Link className="int-view" to={`/profile/${p.user._id}`}>
                        View profile
                      </Link>
                      {sent[p.user._id] ? (
                        <p className="success">{sent[p.user._id]}</p>
                      ) : (
                        <button className="btn-primary" onClick={() => sendInterest(p.user._id)}>
                          💌 Send Interest
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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