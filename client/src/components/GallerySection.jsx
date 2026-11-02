import { useEffect, useState } from "react";
import api from "../api";

export default function GallerySection() {
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api
      .get("/profile/me")
      .then((res) => setPhotos(res.data.photos || []))
      .catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessage("");
    setError("");
    setUploading(true);
    try {
      const data = new FormData();
      data.append("photo", file);
      const res = await api.post("/profile/photos", data);
      setPhotos(res.data.photos);
      setMessage("Photo added");
    } catch (err) {
      setError(err.response?.data?.message || "Photo upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = async (url) => {
    setMessage("");
    setError("");
    try {
      const res = await api.post("/profile/photos/remove", { url });
      setPhotos(res.data.photos);
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove photo");
    }
  };

  return (
    <div className="form-card">
      <h3>More photos ({photos.length}/5)</h3>
      <p className="muted">Add up to 5 photos. They show on your profile page.</p>

      <div className="gallery-edit">
        {photos.map((url) => (
          <div className="gallery-thumb" key={url}>
            <img src={url} alt="Gallery" />
            <button type="button" onClick={() => handleRemove(url)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {photos.length < 5 && (
        <label className="btn-secondary file-btn">
          {uploading ? "Uploading..." : "Add photo"}
          <input type="file" accept="image/*" onChange={handleAdd} disabled={uploading} hidden />
        </label>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}