import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("auth/register/", { username, password });
      const res = await api.post("auth/login/", { username, password });
      login(res.data.access);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.username?.[0] ||
          "Registration failed"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Username</label>
        <input
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setFocusedField("username")}
          onBlur={() => setFocusedField(null)}
          style={{
            ...styles.input,
            ...(focusedField === "username" ? styles.inputFocus : {}),
          }}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Password</label>
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          style={{
            ...styles.input,
            ...(focusedField === "password" ? styles.inputFocus : {}),
          }}
        />
      </div>

      <button type="submit" style={styles.button}>
        Create Account
      </button>

      {error && <p style={styles.error}>{error}</p>}
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#5a3a3f",
    marginLeft: "0.2rem",
  },
  input: {
    width: "100%",
    padding: "1rem 1.3rem",
    fontSize: 17,
    border: "2px solid rgba(255, 182, 193, 0.4)",
    borderRadius: 14,
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
    color: "#5a3a3f",
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontWeight: 500,
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
    boxSizing: "border-box",
  },
  inputFocus: {
    border: "2px solid #fd6585",
    background: "rgba(255, 255, 255, 0.9)",
    boxShadow:
      "0 0 0 4px rgba(253,101,133,0.15), inset 0 2px 4px rgba(0,0,0,0.05)",
    transform: "translateY(-1px)",
  },
  button: {
    width: "100%",
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
    margin: "0.5rem 0 0",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.8)",
    padding: "0.8rem",
    borderRadius: 10,
    fontWeight: 500,
  },
};

export default Register;
