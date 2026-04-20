import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [error, setError] = useState("");

  const handleRegister = () => {
    setError("");

    if (!email || !password) {
      setError("Email ve şifre zorunludur");
      return;
    }

    try {
      registerUser({ email, password, role });

      alert("Kayıt başarılı 🎉");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🌱 Hesap Oluştur</h2>
        <p style={styles.subtitle}>Akıllı Tarım Sistemine katıl</p>

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Şifre"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          style={styles.input}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Yönetici</option>
          <option value="greenhouse_manager">Sera Yöneticisi</option>
          <option value="farmer">Çiftçi</option>
        </select>

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.button} onClick={handleRegister}>
          Kayıt Ol
        </button>

        <p style={styles.link}>
          Zaten hesabın var mı? <Link to="/">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1b5e20, #66bb6a)",
  },
  card: {
    width: 380,
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
    color: "#666",
    marginBottom: 15,
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
  link: {
    marginTop: 10,
    fontSize: 13,
  },
};