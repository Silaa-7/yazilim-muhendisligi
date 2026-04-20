import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { getSession } from "../services/auth";

export default function Activities() {
  const user = getSession();

  const [list, setList] = useState([]);
  const [type, setType] = useState("gübreleme");
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("activities");
    if (saved) setList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(list));
  }, [list]);

  const addActivity = () => {
    if (!note.trim()) return;

    setList([
      {
        id: Date.now(),
        owner: user?.email,
        type,
        note,
        date: new Date().toLocaleString(),
      },
      ...list,
    ]);

    setNote("");
  };

  const deleteActivity = (id) => {
    setList(list.filter((i) => i.id !== id));
  };

  return (
    <MainLayout>
      <div style={styles.page}>
        <div style={styles.overlay}></div>

        <div style={styles.wrapper}>
          <div style={styles.header}>
            <h1>🌱 Tarım Yönetim Paneli</h1>
            <p>Aktiviteleri profesyonel şekilde yönet</p>
          </div>

          <div style={styles.grid}>
            {/* FORM */}
            <div style={styles.formPanel}>
              <h3>➕ Yeni Aktivite</h3>

              <div style={styles.field}>
                <label>İşlem Türü</label>
                <select
                  style={styles.input}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="gübreleme">🌿 Gübreleme</option>
                  <option value="ilaçlama">🧪 İlaçlama</option>
                </select>
              </div>

              <div style={styles.field}>
                <label>Açıklama</label>
                <input
                  style={styles.input}
                  placeholder="Örn: Domates alanı gübreleme"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <button style={styles.button} onClick={addActivity}>
                Kaydet
              </button>
            </div>

            {/* LIST */}
            <div style={styles.listPanel}>
              <h3>📋 Son Aktiviteler</h3>

              {list.length === 0 ? (
                <p style={styles.empty}>Henüz kayıt yok</p>
              ) : (
                list.map((i) => (
                  <div key={i.id} style={styles.card}>
                    <div>
                      <strong>
                        {i.type === "gübreleme" ? "🌿" : "🧪"} {i.type}
                      </strong>
                      <p>{i.note}</p>
                      <small>{i.date}</small>
                      <div style={styles.owner}>👤 {i.owner}</div>
                    </div>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteActivity(i.id)}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/* 🎨 STYLES WITH BACKGROUND IMAGE */
const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",

    // 🚜 TARIMSAL ARKAPLAN (İLAÇLAMA SAHASI)
    backgroundImage:
      "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')",

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    color: "white",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
  },

  wrapper: {
    position: "relative",
    padding: "30px",
    zIndex: 2,
  },

  header: {
    marginBottom: "25px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "20px",
  },

  formPanel: {
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(14px)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  listPanel: {
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(14px)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
  },

  input: {
    marginTop: "5px",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  button: {
    marginTop: "15px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.06)",
    padding: "12px",
    borderRadius: "12px",
    marginTop: "10px",
  },

  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontSize: "18px",
    cursor: "pointer",
  },

  owner: {
    fontSize: "12px",
    opacity: 0.7,
  },

  empty: {
    opacity: 0.6,
  },
};