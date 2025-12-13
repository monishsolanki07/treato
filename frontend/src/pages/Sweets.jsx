// src/pages/Sweets.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await api.get("");
        setSweets(res.data.results ?? res.data);
      } catch (err) {
        setError("Failed to load sweets");
      }
    };

    fetchSweets();
  }, []);

  return (
    <div>
      <h2>Sweets</h2>

      {error && <p>{error}</p>}

      <ul>
        {sweets.map((s) => (
          <li key={s.id}>
            {s.name} — ₹{s.price} (Qty: {s.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sweets;
