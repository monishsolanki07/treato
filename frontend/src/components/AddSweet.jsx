import { useState } from "react";
import api from "../api/axios";

function AddSweet({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["Chocolate", "Candy", "Cake", "Cookie", "Pastry"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);
      data.append("description", formData.description);
      if (image) {
        data.append("image", image);
      }

      await api.post("", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
      });
      setImage(null);
      
      if (onSuccess) onSuccess();
      alert("Sweet added successfully! 🍭");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add sweet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍰 Add New Sweet</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Sweet Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="e.g., Chocolate Truffle"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={styles.input}
              placeholder="250.00"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              style={styles.input}
              placeholder="10"
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Describe your sweet..."
            rows="3"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
          />
          {image && (
            <p style={styles.fileName}>Selected: {image.name}</p>
          )}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Adding..." : "🍭 Add Sweet"}
        </button>
      </form>
    </div>
  );
}

export default AddSweet;

const styles = {
  container: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: "2rem",
    marginBottom: "3rem",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    margin: "0 0 1.5rem 0",
    fontSize: 24,
    fontWeight: 800,
    background: "linear-gradient(135deg, #fd6585 0%, #d3959b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.2rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#5a3a3f",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    padding: "0.9rem 1.1rem",
    fontSize: 15,
    border: "2px solid rgba(255, 182, 193, 0.4)",
    borderRadius: 12,
    background: "rgba(255, 255, 255, 0.8)",
    color: "#5a3a3f",
    outline: "none",
    transition: "all 0.3s ease",
    fontWeight: 500,
  },
  textarea: {
    padding: "0.9rem 1.1rem",
    fontSize: 15,
    border: "2px solid rgba(255, 182, 193, 0.4)",
    borderRadius: 12,
    background: "rgba(255, 255, 255, 0.8)",
    color: "#5a3a3f",
    outline: "none",
    transition: "all 0.3s ease",
    fontWeight: 500,
    fontFamily: "inherit",
    resize: "vertical",
  },
  fileInput: {
    padding: "0.7rem",
    fontSize: 14,
    border: "2px dashed rgba(255, 182, 193, 0.4)",
    borderRadius: 12,
    background: "rgba(255, 255, 255, 0.8)",
    cursor: "pointer",
  },
  fileName: {
    fontSize: 13,
    color: "#636e72",
    margin: "0.3rem 0 0 0",
  },
  button: {
    padding: "1.1rem",
    fontSize: 17,
    fontWeight: 700,
    border: "none",
    borderRadius: 14,
    background: "linear-gradient(135deg, #fd6585 0%, #ff9a9e 100%)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 12px 32px rgba(253, 101, 133, 0.5)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginTop: "0.5rem",
  },
  error: {
    color: "#d63031",
    fontSize: 14,
    margin: 0,
    background: "rgba(214, 48, 49, 0.1)",
    padding: "0.8rem",
    borderRadius: 10,
    fontWeight: 500,
  },
};
