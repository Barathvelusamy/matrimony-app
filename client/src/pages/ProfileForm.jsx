import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    <div className="card wide">
      <h2>My Profile</h2>
      {status && <p className="badge">Status: {status}</p>}
      <form onSubmit={handleSubmit}>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label>Date of birth</label>
        <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
        <input name="height" type="number" placeholder="Height (cm)" value={form.height} onChange={handleChange} />
        <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
          <option value="never married">Never married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
        <input name="religion" placeholder="Religion" value={form.religion} onChange={handleChange} />
        <input name="community" placeholder="Community" value={form.community} onChange={handleChange} />
        <input name="star" placeholder="Star (nakshatram)" value={form.star} onChange={handleChange} />
        <input name="education" placeholder="Education" value={form.education} onChange={handleChange} />
        <input name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
        <textarea name="about" placeholder="About me (max 500 characters)" value={form.about} onChange={handleChange} />
        <button type="submit">Save profile</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <button className="secondary" onClick={() => navigate("/dashboard")}>
        Back to dashboard
      </button>
    </div>
  );
}