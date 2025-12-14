import { useState } from "react";
import api from "../api/axios";

function SweetCard({ sweet, onUpdate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await api.post(`${sweet.id}/purchase/`);
      onUpdate();
    } catch {
      alert("Purchase failed");
    } finally {
      setIsPurchasing(false);
    }
  };

  // Get image URL or use placeholder
  const imageUrl = sweet.image 
    ? `${api.defaults.baseURL.replace('/api/', '')}${sweet.image}`
    : "https://via.placeholder.com/300x200/fd6585/ffffff?text=No+Image";

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(253,101,133,0.3)"
          : "0 10px 25px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div style={styles.imageContainer}>
        <img src={imageUrl} alt={sweet.name} style={styles.image} />
        <div style={styles.badge}>{sweet.category}</div>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        <h3 style={styles.name}>{sweet.name}</h3>

        {sweet.description && (
          <p style={styles.description}>
            {sweet.description.length > 80
              ? `${sweet.description.substring(0, 80)}...`
              : sweet.description}
          </p>
        )}

        <div style={styles.infoRow}>
          <div style={styles.priceBox}>
            <span style={styles.priceLabel}>Price</span>
            <span style={styles.price}>₹{sweet.price}</span>
          </div>

          <div style={styles.stockBox}>
            <span style={styles.stockLabel}>Stock</span>
            <span
              style={{
                ...styles.stock,
                color: sweet.quantity === 0 ? "#d63031" : "#00b894",
              }}
            >
              {sweet.quantity}
            </span>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={sweet.quantity === 0 || isPurchasing}
          style={{
            ...styles.button,
            background:
              sweet.quantity === 0
                ? "linear-gradient(135deg, #dfe6e9, #b2bec3)"
                : "linear-gradient(135deg, #fd6585 0%, #ff9a9e 100%)",
            cursor:
              sweet.quantity === 0 || isPurchasing
                ? "not-allowed"
                : "pointer",
            opacity: isPurchasing ? 0.7 : 1,
          }}
        >
          {isPurchasing
            ? "Processing..."
            : sweet.quantity === 0
            ? "Out of Stock"
            : "🛒 Buy Now"}
        </button>
      </div>
    </div>
  );
}

export default SweetCard;

const styles = {
  card: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    border: "2px solid rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    overflow: "hidden",
    backgroundColor: "#ffecd2",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  badge: {
    position: "absolute",
    top: 15,
    right: 15,
    background: "linear-gradient(135deg, #a29bfe, #fd79a8)",
    color: "#fff",
    padding: "0.4rem 0.9rem",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    boxShadow: "0 4px 12px rgba(162,155,254,0.4)",
  },
  content: {
    padding: "1.8rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  name: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#2d3436",
    letterSpacing: "-0.01em",
  },
  description: {
    margin: 0,
    fontSize: 14,
    color: "#636e72",
    lineHeight: 1.5,
  },
  infoRow: {
    display: "flex",
    gap: "1rem",
    marginTop: "0.5rem",
  },
  priceBox: {
    flex: 1,
    background: "rgba(253,101,133,0.1)",
    padding: "0.8rem",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#8b5a5f",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  price: {
    fontSize: 20,
    fontWeight: 800,
    color: "#fd6585",
  },
  stockBox: {
    flex: 1,
    background: "rgba(0,184,148,0.1)",
    padding: "0.8rem",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  stockLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#636e72",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  stock: {
    fontSize: 20,
    fontWeight: 800,
  },
  button: {
    marginTop: "0.5rem",
    border: "none",
    padding: "1rem",
    borderRadius: 14,
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(253,101,133,0.4)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
};
