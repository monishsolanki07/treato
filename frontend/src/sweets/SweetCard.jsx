import api from "../api/axios";

function SweetCard({ sweet, onUpdate }) {
  const handlePurchase = async () => {
    try {
      await api.post(`${sweet.id}/purchase/`);
      onUpdate(); // refresh list
    } catch {
      alert("Purchase failed");
    }
  };

  return (
    <div style={styles.card}>
      <h3>{sweet.name}</h3>
      <p style={styles.category}>{sweet.category}</p>

      <p>
        💰 <strong>₹{sweet.price}</strong>
      </p>
      <p>
        📦 Quantity:{" "}
        <strong
          style={{
            color: sweet.quantity === 0 ? "red" : "green",
          }}
        >
          {sweet.quantity}
        </strong>
      </p>

      <button
        onClick={handlePurchase}
        disabled={sweet.quantity === 0}
        style={{
          ...styles.button,
          background: sweet.quantity === 0 ? "#ccc" : "#ff7675",
        }}
      >
        {sweet.quantity === 0 ? "Out of stock" : "Buy"}
      </button>
    </div>
  );
}

export default SweetCard;

const styles = {
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "1.5rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    transition: "transform 0.2s",
  },
  category: {
    color: "#888",
    fontSize: "0.9rem",
  },
  button: {
    marginTop: "auto",
    border: "none",
    padding: "0.7rem",
    borderRadius: 8,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
