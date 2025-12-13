import { useEffect, useState } from "react";
import api from "../api/axios";

function SweetsList() {
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await api.get("");
        // paginated response → results
        setSweets(res.data.results || res.data);
      } catch (err) {
        setError("Failed to load sweets");
      } finally {
        setLoading(false);
      }
    };

    fetchSweets();
  }, []);

  if (loading) return <p>Loading sweets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Available Sweets</h2>
      {sweets.map((sweet) => (
        <div key={sweet.id} style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
          <h3>{sweet.name}</h3>
          <p>Category: {sweet.category}</p>
          <p>Price: ₹{sweet.price}</p>
          <p>Quantity: {sweet.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default SweetsList;
