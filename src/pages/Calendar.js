import { useState } from "react";
import MainLayout from "../components/MainLayout";
import {
  addCropPlan,
  getCropPlans,
  deleteCropPlan,
} from "../services/calendar";

import { getSession } from "../services/auth";

export default function Calendar() {
  const user = getSession();

  const [product, setProduct] = useState("");
  const [date, setDate] = useState("");
  const [plans, setPlans] = useState(getCropPlans());

  if (!user) {
    return (
      <MainLayout>
        <div style={styles.center}>
          <div style={styles.errorCard}>❌ Lütfen giriş yapınız</div>
        </div>
      </MainLayout>
    );
  }

  const handleSave = () => {
    if (!product || !date) return;

    addCropPlan({ product, date });
    setPlans([...getCropPlans()]);

    setProduct("");
    setDate("");
  };

  const handleDelete = (id) => {
    deleteCropPlan(id);
    setPlans([...getCropPlans()]);
  };

  const getDaysLeft = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  return (
    <MainLayout>
      <div style={styles.page}>
        <div style={styles.overlay}></div>

        <div style={styles.container}>
          <h2 style={styles.title}>📅 Ekim Takvimi</h2>

          {/* FORM */}
          <div style={styles.formCard}>
            <input
              placeholder="🌱 Ürün adı"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              style={styles.input}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
            />

            <button onClick={handleSave} style={styles.button}>
              + Ekle
            </button>
          </div>

          {/* LIST */}
          <h3 style={styles.subtitle}>📌 Planlar</h3>

          {plans.length === 0 ? (
            <div style={styles.empty}>Henüz plan yok</div>
          ) : (
            <div style={styles.grid}>
              {plans.map((p) => {
                const daysLeft = getDaysLeft(p.date);
                const isPast = daysLeft < 0;

                return (
                  <div key={p.id} style={styles.card}>
                    <div>
                      <div style={styles.product}>🌱 {p.product}</div>
                      <div style={styles.date}>📅 {p.date}</div>

                      {!isPast ? (
                        <div style={styles.future}>
                          ⏳ {daysLeft} gün kaldı
                        </div>
                      ) : (
                        <div style={styles.done}>✅ Tamamlandı</div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(p.id)}
                      style={styles.delete}
                    >
                      🗑
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

/* 🎨 MODERN STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
  },

  container: {
    position: "relative",
    zIndex: 2,
    padding: "30px",
    color: "#f1f5f9",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  subtitle: {
    marginTop: "25px",
    marginBottom: "10px",
    fontSize: "18px",
    color: "#cbd5e1",
  },

  formCard: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    padding: "15px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  input: {
    flex: 1,
    minWidth: "180px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(0,0,0,0.4)",
    color: "white",
    outline: "none",
  },

  button: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "12px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "0.2s",
  },

  product: {
    fontWeight: "600",
    fontSize: "16px",
  },

  date: {
    fontSize: "13px",
    color: "#cbd5e1",
    marginTop: "4px",
  },

  future: {
    marginTop: "6px",
    color: "#facc15",
    fontSize: "13px",
  },

  done: {
    marginTop: "6px",
    color: "#22c55e",
    fontSize: "13px",
  },

  delete: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 10px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    color: "#94a3b8",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    marginTop: "60px",
  },

  errorCard: {
    background: "#ef4444",
    padding: "15px 20px",
    borderRadius: "12px",
    color: "white",
    fontWeight: "bold",
  },
};