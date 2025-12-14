import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import AddSweet from "../components/AddSweet";
import EditSweet from "../components/EditSweet";

function AdminDashboard() {
  const [sweets, setSweets] = useState([]);
  const [editingSweet, setEditingSweet] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchAllSweets = async () => {
    setLoading(true);
    try {
      // Fetch all pages
      let allSweets = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await api.get(`?page=${page}`);
        allSweets = [...allSweets, ...(res.data.results || [])];
        hasMore = res.data.next !== null;
        page++;
      }

      setSweets(allSweets);
    } catch (error) {
      console.error("Failed to fetch sweets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sweet?")) {
      try {
        await api.delete(`${id}/`);
        fetchAllSweets();
        alert("Sweet deleted successfully! 🗑️");
      } catch (error) {
        alert("Failed to delete sweet");
      }
    }
  };

  const handleRestock = async (id) => {
    const amount = prompt("Enter restock amount:");
    if (amount && parseInt(amount) > 0) {
      try {
        await api.post(`${id}/restock/`, { amount: parseInt(amount) });
        fetchAllSweets();
        alert("Sweet restocked successfully! 📦");
      } catch (error) {
        alert("Failed to restock sweet");
      }
    }
  };

  useEffect(() => {
    fetchAllSweets();
  }, []);

  return (
    <div style={styles.page}>
      {/* Admin Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.brand}>
            <span style={styles.logo}>🍩</span>
            <h2 style={styles.brandName}>Treato Admin</h2>
          </div>
          <div style={styles.navButtons}>
            <button onClick={() => navigate("/")} style={styles.userViewBtn}>
              👤 User View
            </button>
            <button onClick={() => {
              logout();
              navigate("/login");
            }} style={styles.logoutBtn}>
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>🎛️ Admin Dashboard</h1>
            <p style={styles.subtitle}>Manage your sweet inventory</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingSweet(null);
            }}
            style={styles.addBtn}
          >
            {showAddForm ? "❌ Cancel" : "➕ Add New Sweet"}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <AddSweet
            onSuccess={() => {
              fetchAllSweets();
              setShowAddForm(false);
            }}
          />
        )}

        {/* Edit Form */}
        {editingSweet && (
          <EditSweet
            sweet={editingSweet}
            onSuccess={() => {
              fetchAllSweets();
              setEditingSweet(null);
            }}
            onCancel={() => setEditingSweet(null)}
          />
        )}

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🍬</div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Sweets</p>
              <h2 style={styles.statValue}>{sweets.length}</h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📦</div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Stock</p>
              <h2 style={styles.statValue}>
                {sweets.reduce((sum, s) => sum + s.quantity, 0)}
              </h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>⚠️</div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Low Stock</p>
              <h2 style={styles.statValue}>
                {sweets.filter((s) => s.quantity < 10).length}
              </h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Value</p>
              <h2 style={styles.statValue}>
                ₹
                {sweets
                  .reduce((sum, s) => sum + s.price * s.quantity, 0)
                  .toFixed(2)}
              </h2>
            </div>
          </div>
        </div>

        {/* Sweets Table */}
        {loading ? (
          <p style={styles.loading}>Loading... 🍭</p>
        ) : (
          <div style={styles.tableCard}>
            <h3 style={styles.tableTitle}>All Sweets Inventory</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sweets.map((sweet) => (
                    <tr key={sweet.id} style={styles.tr}>
                      <td style={styles.td}>{sweet.id}</td>
                      <td style={styles.td}>
                        <strong>{sweet.name}</strong>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>
                          {sweet.category}
                        </span>
                      </td>
                      <td style={styles.td}>₹{sweet.price}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.stockBadge,
                            background:
                              sweet.quantity === 0
                                ? "#ff7675"
                                : sweet.quantity < 10
                                ? "#fdcb6e"
                                : "#00b894",
                          }}
                        >
                          {sweet.quantity}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {sweet.quantity === 0
                          ? "❌ Out of Stock"
                          : sweet.quantity < 10
                          ? "⚠️ Low"
                          : "✅ In Stock"}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionBtns}>
                          <button
                            onClick={() => setEditingSweet(sweet)}
                            style={styles.editBtn}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleRestock(sweet.id)}
                            style={styles.restockBtn}
                            title="Restock"
                          >
                            📦
                          </button>
                          <button
                            onClick={() => handleDelete(sweet.id)}
                            style={styles.deleteBtn}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  },
  navbar: {
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(20px)",
    borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
    padding: "1rem 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  navContent: {
    maxWidth: 1600,
    margin: "0 auto",
    padding: "0 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },
  logo: {
    fontSize: 40,
    filter: "drop-shadow(0 4px 8px rgba(253,101,133,0.4))",
  },
  brandName: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    background: "linear-gradient(135deg, #fd6585 0%, #d3959b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  navButtons: {
    display: "flex",
    gap: "1rem",
  },
  userViewBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(255, 255, 255, 0.9)",
    border: "2px solid #fd6585",
    padding: "0.7rem 1.5rem",
    borderRadius: 999,
    color: "#fd6585",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "linear-gradient(135deg, #fd6585 0%, #ff9a9e 100%)",
    border: "none",
    padding: "0.7rem 1.5rem",
    borderRadius: 999,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(253,101,133,0.4)",
    transition: "all 0.3s ease",
  },
  container: {
    maxWidth: 1600,
    margin: "0 auto",
    padding: "3rem 2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "3rem",
  },
  title: {
    fontSize: 42,
    fontWeight: 800,
    margin: 0,
    background: "linear-gradient(135deg, #fd6585 0%, #d3959b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    color: "#8b5a5f",
    fontSize: 18,
    marginTop: "0.5rem",
    fontWeight: 500,
  },
  addBtn: {
    background: "linear-gradient(135deg, #00b894, #00cec9)",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: 14,
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,184,148,0.4)",
    transition: "all 0.3s ease",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem",
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: "2rem",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  statIcon: {
    fontSize: 48,
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    margin: 0,
    fontSize: 14,
    color: "#636e72",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  statValue: {
    margin: "0.5rem 0 0 0",
    fontSize: 32,
    fontWeight: 800,
    color: "#2d3436",
  },
  tableCard: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: "2rem",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  tableTitle: {
    margin: "0 0 1.5rem 0",
    fontSize: 24,
    fontWeight: 700,
    color: "#2d3436",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "1rem",
    background: "#f5f6fa",
    color: "#2d3436",
    fontWeight: 700,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "2px solid #dfe6e9",
  },
  tr: {
    borderBottom: "1px solid #f1f3f5",
    transition: "background 0.2s ease",
  },
  td: {
    padding: "1rem",
    fontSize: 15,
    color: "#2d3436",
  },
  categoryBadge: {
    background: "linear-gradient(135deg, #a29bfe, #fd79a8)",
    color: "#fff",
    padding: "0.3rem 0.8rem",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  stockBadge: {
    color: "#fff",
    padding: "0.3rem 0.8rem",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
  },
  actionBtns: {
    display: "flex",
    gap: "0.5rem",
  },
  editBtn: {
    background: "#74b9ff",
    border: "none",
    padding: "0.5rem 0.8rem",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    transition: "all 0.3s ease",
  },
  restockBtn: {
    background: "#00b894",
    border: "none",
    padding: "0.5rem 0.8rem",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    transition: "all 0.3s ease",
  },
  deleteBtn: {
    background: "#ff7675",
    border: "none",
    padding: "0.5rem 0.8rem",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    transition: "all 0.3s ease",
  },
  loading: {
    textAlign: "center",
    fontSize: 20,
    color: "#8b5a5f",
    fontWeight: 600,
    padding: "3rem",
  },
};
