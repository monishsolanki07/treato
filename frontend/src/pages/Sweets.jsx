import { useEffect, useState } from "react";
import api from "../api/axios";
import SweetCard from "../sweets/SweetCard";

function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState("");

  const fetchSweets = async () => {
    try {
      const res = await api.get(""); // baseURL already /api/
      setSweets(res.data.results || res.data);
    } catch {
      setError("Failed to load sweets");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🍬 Treato Sweets</h1>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {sweets.map((sweet) => (
          <SweetCard
            key={sweet.id}
            sweet={sweet}
            onUpdate={fetchSweets}
          />
        ))}
      </div>
    </div>
  );
}

export default Sweets;

const styles = {
  page: {
    padding: "2rem",
    background: "#fafafa",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};
