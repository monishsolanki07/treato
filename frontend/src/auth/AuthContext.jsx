import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const getUserFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      userId: payload.user_id,
      // Add other user info from token if available
    };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("accessToken");
    const storedAdmin = localStorage.getItem("isAdmin") === "true";

    if (stored && isTokenValid(stored)) {
      setToken(stored);
      setIsAdmin(storedAdmin);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("isAdmin");
    }

    setLoading(false);
  }, []);

  const login = (accessToken, adminStatus = false) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("isAdmin", adminStatus);
    setToken(accessToken);
    setIsAdmin(adminStatus);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    setToken(null);
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>🍩</div>
        <p style={styles.loadingText}>Loading Treato...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  },
  loader: {
    fontSize: 80,
    animation: "spin 2s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    fontSize: 20,
    fontWeight: 600,
    color: "#8b5a5f",
  },
};

// Add this to your global CSS (index.css or App.css)
// @keyframes spin {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }
