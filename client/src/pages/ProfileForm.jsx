import { useEffect, useState } from "react";
import api from "../api";

const empty = {
  gender: "",
  dateOfBirth: "",
  height: "",
  maritalStatus: "never married",
  religion: "",
  community: "",
  star: "",
  education: "",
  occupation: "",
  city: "",
  state: "",
  about: "",
};

export default function ProfileForm() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/profile/me")
      .then((res) => {
        const p = res.data;
        setForm({
          ...empty,
          ...p,
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : "",
        });
        setStatus(p.status);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.post("/profile", form);
      setStatus(res.data.profile.status);
      setMessage("Profile saved");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">My Profile</h2>
        {status && <span className={`status status-${status}`}>{status}</span>}
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Basic details</h3>
        <div className="form-grid">
          <div>
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label>Date of birth</label>
            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
          </div>
          <div>
            <label>Height (cm)</label>
            <input name="height" type="number" value={form.height} onChange={handleChange} />
          </div>
          <div>
            <label>Marital status</label>
            <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
              <option value="never married">Never married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </div>

        <h3>Background</h3>
        <div className="form-grid">
          <div>
            <label>Religion</label>
            <input name="religion" value={form.religion} onChange={handleChange} />
          </div>
          <div>
            <label>Community</label>
            <input name="community" value={form.community} onChange={handleChange} />
          </div>
          <div>
            <label>Star (nakshatram)</label>
            <input name="star" value={form.star} onChange={handleChange} />
          </div>
        </div>

        <h3>Education and work</h3>
        <div className="form-grid">
          <div>
            <label>Education</label>
            <input name="education" value={form.education} onChange={handleChange} />
          </div>
          <div>
            <label>Occupation</label>
            <input name="occupation" value={form.occupation} onChange={handleChange} />
          </div>
        </div>

        <h3>Location</h3>
        <div className="form-grid">
          <div>
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>
          <div>
            <label>State</label>
            <input name="state" value={form.state} onChange={handleChange} />
          </div>
        </div>

        <h3>About me</h3>
        <textarea
          name="about"
          placeholder="A few lines about yourself (max 500 characters)"
          value={form.about}
          onChange={handleChange}
        />

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary">
          Save profile
        </button>
      </form>
    </div>
  );
}