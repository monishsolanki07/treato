import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import SweetCard from "../sweets/SweetCard";
import { useAuth } from "../auth/AuthContext";

function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Pagination states
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  const categories = ["Chocolate", "Candy", "Cake", "Cookie", "Pastry"];

  const fetchSweets = async (page = 1) => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", page);
      if (searchName) params.append("name", searchName);
      if (selectedCategory) params.append("category", selectedCategory);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (ordering) params.append("ordering", ordering);

      const res = await api.get(`?${params.toString()}`);
      setSweets(res.data.results || res.data);
      setPagination({
        count: res.data.count || 0,
        next: res.data.next,
        previous: res.data.previous,
      });
      setError("");
    } catch {
      setError("Failed to load sweets");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const clearFilters = () => {
    setSearchName("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setOrdering("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchSweets(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchSweets(1);
  }, [searchName, selectedCategory, minPrice, maxPrice, ordering]);

  const totalPages = Math.ceil(pagination.count / 4);

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.brand}>
            <span style={styles.logo}>🍩</span>
            <h2 style={styles.brandName}>Treato</h2>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <span style={styles.logoutIcon}>🚪</span>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🍬 Sweet Collection</h1>
          <p style={styles.subtitle}>
            Indulge in our delicious selection of treats
          </p>
          {pagination.count > 0 && (
            <p style={styles.itemCount}>
              Showing {sweets.length} of {pagination.count} sweets
            </p>
          )}
        </div>

        {/* Filters Section */}
        <div style={styles.filtersCard}>
          <div style={styles.filtersHeader}>
            <h3 style={styles.filtersTitle}>🔍 Search & Filter</h3>
            <button onClick={clearFilters} style={styles.clearBtn}>
              Clear All
            </button>
          </div>

          <div style={styles.filtersGrid}>
            {/* Search by name */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Search by Name</label>
              <input
                type="text"
                placeholder="Search sweets..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                style={styles.filterInput}
              />
            </div>

            {/* Category */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Min Price (₹)</label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max Price (₹)</label>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={styles.filterInput}
              />
            </div>

            {/* Sort */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Sort By</label>
              <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">Default</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="-name">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {loading ? (
          <p style={styles.loading}>Loading delicious sweets... 🍭</p>
        ) : (
          <>
            <div style={styles.grid}>
              {sweets.length === 0 ? (
                <p style={styles.noResults}>
                  No sweets found. Try different filters!
                </p>
              ) : (
                sweets.map((sweet) => (
                  <SweetCard
                    key={sweet.id}
                    sweet={sweet}
                    onUpdate={() => fetchSweets(currentPage)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {sweets.length > 0 && totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.previous}
                  style={{
                    ...styles.pageBtn,
                    opacity: pagination.previous ? 1 : 0.5,
                    cursor: pagination.previous ? "pointer" : "not-allowed",
                  }}
                >
                  ← Previous
                </button>

                <div style={styles.pageNumbers}>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        style={{
                          ...styles.pageNumber,
                          ...(currentPage === pageNum
                            ? styles.pageNumberActive
                            : {}),
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.next}
                  style={{
                    ...styles.pageBtn,
                    opacity: pagination.next ? 1 : 0.5,
                    cursor: pagination.next ? "pointer" : "not-allowed",
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Sweets;

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
    maxWidth: 1400,
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
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  logoutIcon: {
    fontSize: 18,
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "3rem 2rem",
  },
  header: {
    textAlign: "center",
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
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "#8b5a5f",
    fontSize: 18,
    marginTop: "0.5rem",
    fontWeight: 500,
  },
  itemCount: {
    color: "#8b5a5f",
    fontSize: 14,
    marginTop: "0.5rem",
    fontWeight: 600,
  },
  filtersCard: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: "2rem",
    marginBottom: "3rem",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  filtersHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  filtersTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#2d3436",
  },
  clearBtn: {
    background: "transparent",
    border: "2px solid #fd6585",
    color: "#fd6585",
    padding: "0.5rem 1rem",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#5a3a3f",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  filterInput: {
    padding: "0.8rem 1rem",
    fontSize: 15,
    border: "2px solid rgba(255, 182, 193, 0.4)",
    borderRadius: 10,
    background: "rgba(255, 255, 255, 0.8)",
    color: "#5a3a3f",
    outline: "none",
    transition: "all 0.3s ease",
  },
  filterSelect: {
    padding: "0.8rem 1rem",
    fontSize: 15,
    border: "2px solid rgba(255, 182, 193, 0.4)",
    borderRadius: 10,
    background: "rgba(255, 255, 255, 0.8)",
    color: "#5a3a3f",
    outline: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
  },
  error: {
    color: "#d63031",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.8)",
    padding: "1rem",
    borderRadius: 14,
    fontWeight: 600,
    marginBottom: "2rem",
  },
  loading: {
    textAlign: "center",
    fontSize: 20,
    color: "#8b5a5f",
    fontWeight: 600,
    padding: "3rem",
  },
  noResults: {
    textAlign: "center",
    fontSize: 18,
    color: "#8b5a5f",
    fontWeight: 500,
    padding: "3rem",
    gridColumn: "1 / -1",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "3rem",
    padding: "2rem 0",
  },
  pageBtn: {
    background: "linear-gradient(135deg, #fd6585 0%, #ff9a9e 100%)",
    border: "none",
    padding: "0.8rem 1.5rem",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(253,101,133,0.4)",
  },
  pageNumbers: {
    display: "flex",
    gap: "0.5rem",
  },
  pageNumber: {
    background: "rgba(255, 255, 255, 0.9)",
    border: "2px solid rgba(255, 182, 193, 0.4)",
    padding: "0.6rem 1rem",
    borderRadius: 10,
    color: "#5a3a3f",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: 45,
  },
  pageNumberActive: {
    background: "linear-gradient(135deg, #fd6585 0%, #ff9a9e 100%)",
    color: "#fff",
    border: "2px solid transparent",
    boxShadow: "0 8px 20px rgba(253,101,133,0.4)",
  },
};
