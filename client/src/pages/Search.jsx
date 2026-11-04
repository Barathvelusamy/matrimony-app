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

function Icon({ name }) {
  const paths = {
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    pin: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    book: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
    star: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    send: (
      <>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </>
    ),
  };
  return (
    <svg
      className="sr-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

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
      <div className="sr-banner">
        <h2>Find your perfect match</h2>
        <p>Filter by age, place, education and more to meet the right people.</p>
        <div className="sr-banner-pills">
          <span>Admin reviewed profiles</span>
          <span>Free to search</span>
          <span>Members only photos</span>
        </div>
      </div>

      <form
        className="sr-panel"
        onSubmit={(e) => {
          e.preventDefault();
          search(1);
        }}
      >
        <div className="sr-panel-head">
          <h3>Refine your search</h3>
          <button type="button" className="sr-reset" onClick={clearFilters}>
            Clear all
          </button>
        </div>

        <div className="sr-seg">
          {[
            ["", "Any"],
            ["male", "Male"],
            ["female", "Female"],
          ].map(([val, label]) => (
            <button
              type="button"
              key={label}
              className={filters.gender === val ? "sr-seg-btn on" : "sr-seg-btn"}
              onClick={() => setFilters({ ...filters, gender: val })}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sr-grid-fields">
          <div className="sr-field">
            <label><Icon name="calendar" /> Min age</label>
            <input name="minAge" type="number" placeholder="18" value={filters.minAge} onChange={handleChange} />
          </div>
          <div className="sr-field">
            <label><Icon name="calendar" /> Max age</label>
            <input name="maxAge" type="number" placeholder="40" value={filters.maxAge} onChange={handleChange} />
          </div>
          <div className="sr-field">
            <label><Icon name="pin" /> City</label>
            <input name="city" placeholder="Any city" value={filters.city} onChange={handleChange} />
          </div>
          <div className="sr-field">
            <label><Icon name="book" /> Education</label>
            <input name="education" placeholder="Any education" value={filters.education} onChange={handleChange} />
          </div>
          <div className="sr-field">
            <label><Icon name="star" /> Religion</label>
            <input name="religion" placeholder="Any religion" value={filters.religion} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="sr-go" disabled={loading}>
          <Icon name="search" /> {loading ? "Searching..." : "Search profiles"}
        </button>
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
                    <p className="muted sr-loc">
                      <Icon name="pin" />
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

                    {p.about && <p className="sr-about">{p.about}</p>}

                    <div className="sr-actions">
                      <Link className="int-view" to={`/profile/${p.user._id}`}>
                        View profile
                      </Link>
                      {sent[p.user._id] ? (
                        <p className="success">{sent[p.user._id]}</p>
                      ) : (
                        <button className="btn-primary" onClick={() => sendInterest(p.user._id)}>
                          <Icon name="send" /> Send Interest
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