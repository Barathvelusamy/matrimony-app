import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import Loader from "../components/Loader";

const age = (dob) =>
  Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));

export default function ProfileView() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [sentMsg, setSentMsg] = useState("");

  useEffect(() => {
    api
      .get(`/profile/user/${userId}`)
      .then((res) => {
        setProfile(res.data);
        const all = [res.data.photo, ...(res.data.photos || [])].filter(Boolean);
        setSelected(all[0] || "");
      })
      .catch((err) => setError(err.response?.data?.message || "Something went wrong"));
  }, [userId]);

  const sendInterest = async () => {
    try {
      await api.post(`/interests/send/${userId}`);
      setSentMsg("Interest sent");
    } catch (err) {
      setSentMsg(err.response?.data?.message || "Failed");
    }
  };

  if (error)
    return (
      <div className="page">
        <p className="error">{error}</p>
        <Link to="/search">Back to search</Link>
      </div>
    );
  if (!profile) return <Loader text="Loading profile..." />;

  const allPhotos = [profile.photo, ...(profile.photos || [])].filter(Boolean);

  return (
    <div className="page">
      <Link to="/search" className="back-link">
        Back to search
      </Link>

      <div className="view-card">
        <div className="view-photos">
          {selected ? (
            <img className="view-main" src={selected} alt={profile.user?.name} />
          ) : (
            <div className="view-main view-empty">
              {profile.user?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {allPhotos.length > 1 && (
            <div className="view-thumbs">
              {allPhotos.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Thumbnail"
                  className={url === selected ? "thumb active" : "thumb"}
                  onClick={() => setSelected(url)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="view-info">
          <h2>
            {profile.user?.name}, {age(profile.dateOfBirth)}
          </h2>
          <p className="muted">
            {profile.city}
            {profile.state ? `, ${profile.state}` : ""}
          </p>

          <div className="chips left">
            {profile.education && <span>{profile.education}</span>}
            {profile.occupation && <span>{profile.occupation}</span>}
            {profile.religion && <span>{profile.religion}</span>}
            {profile.community && <span>{profile.community}</span>}
            {profile.star && <span>{profile.star}</span>}
            {profile.height && <span>{profile.height} cm</span>}
            {profile.maritalStatus && <span>{profile.maritalStatus}</span>}
          </div>

          {profile.about && (
            <>
              <h4>About</h4>
              <p>{profile.about}</p>
            </>
          )}

          {sentMsg ? (
            <p className="success">{sentMsg}</p>
          ) : (
            <button className="btn-primary" onClick={sendInterest}>
              Send Interest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}