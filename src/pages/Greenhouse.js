import { useState } from "react";
import MainLayout from "../components/MainLayout";
import { getSession } from "../services/auth";

export default function Greenhouse() {
  const user = getSession();

  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState("sera");

  const addItem = () => {
    if (!name || !location) return;

    const newItem = {
      id: Date.now(),
      owner: user?.email,
      name,
      location,
      area,
      type,
    };

    setItems([newItem, ...items]);

    setName("");
    setLocation("");
    setArea("");
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const openMap = (loc) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      loc
    )}`;
    window.open(url, "_blank");
  };

  return (
    <MainLayout>
      <div style={styles.page}>
        <div style={styles.overlay}></div>

        <div style={styles.container}>
          <h1 style={styles.title}>🌿 Akıllı Sera Yönetimi</h1>
          <p style={styles.subtitle}>
            Tüm tarım alanlarını profesyonel şekilde yönet
          </p>

          {/* FORM */}
          <div style={styles.formCard}>
            <h3 style={styles.sectionTitle}>➕ Yeni Alan Ekle</h3>

            <div style={styles.gridForm}>
              <input
                style={styles.input}
                placeholder="🌱 Alan adı"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="📍 Konum"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="📐 Alan (m²)"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />

              <select
                style={styles.input}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="sera">🌿 Sera</option>
                <option value="parsel">🌾 Parsel</option>
              </select>
            </div>

            <button style={styles.addBtn} onClick={addItem}>
              + Sisteme Ekle
            </button>
          </div>

          {/* LIST */}
          <div style={styles.grid}>
            {items.map((i) => (
              <div key={i.id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.name}>🌱 {i.name}</div>

                  <div style={styles.meta}>📍 {i.location}</div>

                  <div style={styles.meta}>
                    📐 {i.area ? `${i.area} m²` : "Alan belirtilmedi"}
                  </div>

                  <div style={styles.tag}>
                    {i.type === "sera" ? "🌿 Sera" : "🌾 Parsel"}
                  </div>

                  <div style={styles.owner}>👤 {i.owner}</div>

                  <button
                    style={styles.mapBtn}
                    onClick={() => openMap(i.location)}
                  >
                    🗺 Haritada Aç
                  </button>
                </div>

                <button
                  onClick={() => deleteItem(i.id)}
                  style={styles.deleteBtn}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/* 🎨 MODERN UI (TEMİZ + DASHBOARD STYLE) */
const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
  },

  container: {
    position: "relative",
    zIndex: 2,
    padding: "30px",
    maxWidth: "1100px",
    margin: "0 auto",
    color: "#f1f5f9",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "5px",
  },

  subtitle: {
    marginBottom: "25px",
    color: "#cbd5e1",
  },

  sectionTitle: {
    marginBottom: "12px",
  },

  formCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    padding: "18px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "25px",
  },

  gridForm: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginBottom: "12px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(0,0,0,0.4)",
    color: "white",
    outline: "none",
  },

  addBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  cardLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  name: {
    fontSize: "16px",
    fontWeight: "600",
  },

  meta: {
    fontSize: "13px",
    color: "#cbd5e1",
  },

  tag: {
    fontSize: "13px",
    color: "#facc15",
  },

  owner: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  mapBtn: {
    marginTop: "8px",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "8px 10px",
    borderRadius: "10px",
    cursor: "pointer",
    height: "fit-content",
  },
};