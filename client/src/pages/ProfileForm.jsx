import { useEffect, useState } from "react";
import api from "../api";
import GallerySection from "../components/GallerySection";

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
  photo: "",
};

const TRACKED = [
  "gender", "dateOfBirth", "height", "religion", "community",
  "star", "education", "occupation", "city", "state", "about", "photo",
];

export default function ProfileForm() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [photoMsg, setPhotoMsg] = useState("");
  const [photoErr, setPhotoErr] = useState("");
  const [uploading, setUploading] = useState(false);

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
    api
      .get("/auth/me")
      .then((res) => setName(res.data.name))
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

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoMsg("");
    setPhotoErr("");
    setUploading(true);
    try {
      const data = new FormData();
      data.append("photo", file);
      const res = await api.post("/profile/photo", data);
      setForm((f) => ({ ...f, photo: res.data.photo }));
      setPhotoMsg("Photo uploaded");
    } catch (err) {
      setPhotoErr(err.response?.data?.message || "Photo upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const filled = TRACKED.filter((f) => form[f]).length;
  const pct = Math.round((filled / TRACKED.length) * 100);

  return (
    <div className="pf">
      <div className="pf-hero">
        {form.photo ? (
          <img className="pf-photo" src={form.photo} alt="Profile" />
        ) : (
          <div className="pf-photo pf-initial">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </div>
        )}
        <div className="pf-hero-text">
          <h2>{name || "My Profile"}</h2>
          {status && <span className={`status status-${status}`}>{status}</span>}
          <div>
            <label className="pf-photo-btn">
              {uploading ? "Uploading..." : "Change photo"}
              <input type="file" accept="image/*" onChange={handlePhoto} disabled={uploading} hidden />
            </label>
          </div>
          {photoMsg && <p className="success">{photoMsg}</p>}
          {photoErr && <p className="error">{photoErr}</p>}
          <p className="pf-hint">JPG or PNG, up to 2 MB. Save your details first.</p>
        </div>
      </div>

      <div className="pf-progress">
        <div className="pf-progress-top">
          <strong>Profile completion</strong>
          <span>{pct}%</span>
        </div>
        <div className="dash-bar">
          <div className="dash-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="pf-card">
          <h3><span>🧑</span> Basic details</h3>
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
        </div>

        <div className="pf-card">
          <h3><span>🕉️</span> Background</h3>
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
        </div>

        <div className="pf-card">
          <h3><span>🎓</span> Education and work</h3>
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
        </div>

        <div className="pf-card">
          <h3><span>📍</span> Location</h3>
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
        </div>

        <div className="pf-card">
          <h3><span>✍️</span> About me</h3>
          <textarea
            name="about"
            maxLength={500}
            placeholder="A few lines about yourself"
            value={form.about}
            onChange={handleChange}
          />
          <p className="pf-count">{form.about.length}/500</p>
        </div>

        <div className="pf-savebar">
          <div>
            {message && <span className="success">{message}</span>}
            {error && <span className="error">{error}</span>}
          </div>
          <button type="submit" className="btn-primary">
            Save profile
          </button>
        </div>
      </form>

      <GallerySection />
    </div>
  );
}