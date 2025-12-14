import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthLayout() {
  const [mode, setMode] = useState("login");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.candyBg}>
        <div style={styles.candy1}>🍭</div>
        <div style={styles.candy2}>🍬</div>
        <div style={styles.candy3}>🧁</div>
        <div style={styles.candy4}>🍩</div>
        <div style={styles.candy5}>🍫</div>
        <div style={styles.candy6}>🍰</div>
      </div>

      <div
        style={{
          ...styles.card,
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={styles.logoRow}>
          <div style={styles.logoCircle}>🍩</div>
          <div style={styles.brandText}>
            <h1 style={styles.title}>Treato</h1>
            <p style={styles.subtitle}>Sweet inventory made simple</p>
          </div>
        </div>

        <div style={styles.togglePills}>
          <button
            type="button"
            style={{
              ...styles.pill,
              ...(mode === "login" ? styles.pillActive : {}),
            }}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            style={{
              ...styles.pill,
              ...(mode === "register" ? styles.pillActive : {}),
            }}
            onClick={() => setMode("register")}
          >
            Sign up
          </button>
        </div>

        <div style={styles.formContainer}>
          {mode === "login" ? <Login /> : <Register />}
        </div>

        <p style={styles.switchText}>
          {mode === "login" ? (
            <>
              New here?{" "}
              <span style={styles.link} onClick={() => setMode("register")}>
                Create account
              </span>
            </>
          ) : (
            <>
              Already registered?{" "}
              <span style={styles.link} onClick={() => setMode("login")}>
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 15%, #ff9a9e 30%, #fecfef 50%, #ffecd2 70%, #fcb69f 85%, #ff9a9e 100%)",
    padding: "2rem",
    overflow: "hidden",
    position: "relative",
  },
  candyBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  candy1: {
    position: "absolute",
    fontSize: 80,
    top: "5%",
    left: "8%",
    opacity: 0.3,
    animation: "float 15s ease-in-out infinite",
  },
  candy2: {
    position: "absolute",
    fontSize: 60,
    top: "15%",
    right: "12%",
    opacity: 0.25,
    animation: "float 18s ease-in-out infinite reverse",
  },
  candy3: {
    position: "absolute",
    fontSize: 70,
    bottom: "20%",
    left: "15%",
    opacity: 0.3,
    animation: "float 20s ease-in-out infinite",
  },
  candy4: {
    position: "absolute",
    fontSize: 90,
    bottom: "10%",
    right: "10%",
    opacity: 0.2,
    animation: "float 22s ease-in-out infinite reverse",
  },
  candy5: {
    position: "absolute",
    fontSize: 65,
    top: "50%",
    left: "5%",
    opacity: 0.25,
    animation: "float 17s ease-in-out infinite",
  },
  candy6: {
    position: "absolute",
    fontSize: 75,
    top: "60%",
    right: "8%",
    opacity: 0.3,
    animation: "float 19s ease-in-out infinite reverse",
  },
  card: {
    position: "relative",
    width: 480,
    maxWidth: "100%",
    background: "rgba(255, 255, 255, 0.25)",
    padding: "3rem 2.8rem 2.5rem",
    borderRadius: 32,
    border: "2px solid rgba(255, 255, 255, 0.4)",
    boxShadow:
      "0 8px 32px 0 rgba(255, 182, 193, 0.37), 0 25px 60px rgba(252, 182, 159, 0.3), inset 0 0 0 1px rgba(255,255,255,0.2)",
    backdropFilter: "blur(25px) saturate(180%)",
    WebkitBackdropFilter: "blur(25px) saturate(180%)",
    textAlign: "left",
    zIndex: 1,
    transition: "all 0.2s cubic-bezier(0.03, 0.98, 0.52, 0.99)",
    willChange: "transform",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
    gap: "1.2rem",
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ffd3a5 0%, #fd6585 50%, #ff9a9e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 38,
    boxShadow:
      "0 12px 30px rgba(253,101,133,0.5), inset 0 -2px 10px rgba(0,0,0,0.15)",
    border: "3px solid rgba(255,255,255,0.6)",
  },
  brandText: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    margin: 0,
    fontSize: 38,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    background: "linear-gradient(135deg, #fd6585 0%, #d3959b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "none",
  },
  subtitle: {
    margin: "0.4rem 0 0",
    color: "#8b5a5f",
    fontSize: 15,
    fontWeight: 500,
  },
  togglePills: {
    display: "flex",
    background: "rgba(255, 255, 255, 0.35)",
    padding: 6,
    borderRadius: 999,
    gap: 6,
    marginBottom: "2rem",
    border: "1px solid rgba(255,255,255,0.4)",
  },
  pill: {
    flex: 1,
    border: "none",
    borderRadius: 999,
    padding: "0.75rem 1rem",
    fontSize: 15,
    fontWeight: 600,
    background: "transparent",
    color: "#8b5a5f",
    cursor: "pointer",
    transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  pillActive: {
    background: "linear-gradient(135deg, #fd6585 0%, #ff9a9e 100%)",
    color: "#fff",
    boxShadow:
      "0 10px 28px rgba(253, 101, 133, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
  },
  formContainer: {
    marginBottom: "1.8rem",
  },
  switchText: {
    marginTop: "1rem",
    marginBottom: 0,
    fontSize: 15,
    color: "#8b5a5f",
    textAlign: "center",
    fontWeight: 500,
  },
  link: {
    color: "#fd6585",
    cursor: "pointer",
    fontWeight: 700,
    textDecoration: "none",
    borderBottom: "2px solid rgba(253,101,133,0.5)",
    transition: "all 0.2s ease",
  },
};

