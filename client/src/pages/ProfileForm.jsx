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

const TRACKED = {
  photo: "Profile photo",
  gender: "Gender",
  dateOfBirth: "Date of birth",
  height: "Height",
  religion: "Religion",
  community: "Community",
  star: "Star",
  education: "Education",
  occupation: "Occupation",
  city: "City",
  state: "State",
  about: "About me",
};

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

  const keys = Object.keys(TRACKED);
  const missing = keys.filter((k) => !form[k]);
  const pct = Math.round(((keys.length - missing.length) / keys.length) * 100);

  return (
    <div className="pfx">
      <aside className="pfx-side">
        <div className="pfx-cover" />
        {form.photo ? (
          <img className="pfx-photo" src={form.photo} alt="Profile" />
        ) : (
          <div className="pfx-photo pfx-initial">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </div>
        )}
        <h2>{name || "My Profile"}</h2>
        {status && <span className={`status status-${status}`}>{status}</span>}

        <label className="pfx-photo-btn">
          {uploading ? "Uploading..." : "📷 Change photo"}
          <input type="file" accept="image/*" onChange={handlePhoto} disabled={uploading} hidden />
        </label>
        {photoMsg && <p className="success">{photoMsg}</p>}
        {photoErr && <p className="error">{photoErr}</p>}
        <p className="pfx-hint">JPG or PNG, up to 2 MB. Save your details first.</p>

        <div className="pfx-progress">
          <div className="dash-progress-top">
            <strong>Profile completion</strong>
            <span>{pct}%</span>
          </div>
          <div className="dash-bar">
            <div className="dash-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          {missing.length > 0 ? (
            <div className="pfx-missing">
              <small>Still missing:</small>
              <div className="chips left">
                {missing.map((k) => (
                  <span key={k}>{TRACKED[k]}</span>
                ))}
              </div>
            </div>
          ) : (
            <p className="success">All details filled 🎉</p>
          )}
        </div>
      </aside>

      <main className="pfx-main">
        <form onSubmit={handleSubmit}>
          <div className="pfx-grid">
            <div className="pfx-card">
              <h3><span>🧑</span> Basic details</h3>
              <div className="pfx-fields">
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

            <div className="pfx-card">
              <h3><span>🕉️</span> Background</h3>
              <div className="pfx-fields">
                <div>
                  <label>Religion</label>
                  <input name="religion" value={form.religion} onChange={handleChange} />
                </div>
                <div>
                  <label>Community</label>
                  <input name="community" value={form.community} onChange={handleChange} />
                </div>
                <div className="pfx-full">
                  <label>Star (nakshatram)</label>
                  <input name="star" value={form.star} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="pfx-card">
              <h3><span>🎓</span> Education and work</h3>
              <div className="pfx-fields">
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

            <div className="pfx-card">
              <h3><span>📍</span> Location</h3>
              <div className="pfx-fields">
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

            <div className="pfx-card pfx-wide">
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
          </div>

          <div className="pfx-savebar">
            <div>
              {message && <span className="success">{message}</span>}
              {error && <span className="error">{error}</span>}
            </div>
            <button type="submit" className="btn-primary">
              Save profile
            </button>
          </div>
        </form>

        <div className="pfx-gallery">
          <GallerySection />
        </div>
      </main>
    </div>
  );
}