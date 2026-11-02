import { useEffect, useState } from "react";

export default function Loader({ text = "Loading..." }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>{text}</p>
      {slow && (
        <p className="hint">
          The server is waking up. This can take up to a minute on the free plan.
        </p>
      )}
    </div>
  );
}