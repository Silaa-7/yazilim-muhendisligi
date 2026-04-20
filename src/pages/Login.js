import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, setSession } from "../services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email ve şifre zorunludur.");
      return;
    }

    setLoading(true);

    const user = await loginUser(email, password);

    setLoading(false);

    if (!user) {
      setError("Email veya şifre hatalı!");
      return;
    }

    setSession(user);
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🌱 Akıllı Tarım Sistemi</h2>
        <p style={styles.subtitle}>Hesabınıza giriş yapın</p>

        <input
          style={styles.input}
          type="email"
          placeholder="Email adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        {/* ALT LINKLER */}
        <div style={styles.links}>
          <Link to="/forgot-password" style={styles.link}>
            Şifremi unuttum
          </Link>

          <span style={{ margin: "0 10px" }}>|</span>

          <Link to="/register" style={styles.link}>
            Kayıt ol
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1b5e20, #66bb6a)",
  },
  card: {
    width: 360,
    padding: 30,
    borderRadius: 16,
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    margin: "8px 0",
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    border: "none",
    background: "#2e7d32",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 13,
    marginTop: 5,
  },
  links: {
    marginTop: 15,
    fontSize: 13,
  },
  link: {
    color: "#2e7d32",
    textDecoration: "none",
    fontWeight: "bold",
  },
};