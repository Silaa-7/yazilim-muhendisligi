import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { getSession } from "../services/auth";

export default function Reports() {
  const user = getSession();

  const [report, setReport] = useState({
    avgTemp: 0,
    avgHumidity: 0,
    avgSoil: 0,
    efficiency: 0,
    status: "",
  });

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  // 🔐 SADECE ADMIN GÖRÜR VE YAZAR
  const isAdmin = user?.email === "admin@test.com";

  /* 📥 LOAD NOTES */
  useEffect(() => {
    const savedNotes = localStorage.getItem("report_notes");
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  /* 💾 SAVE NOTES */
  useEffect(() => {
    localStorage.setItem("report_notes", JSON.stringify(notes));
  }, [notes]);

  /* 📊 SIMULATION */
  useEffect(() => {
    const temp = 18 + Math.random() * 12;
    const humidity = 35 + Math.random() * 45;
    const soil = 20 + Math.random() * 60;

    const efficiency = Math.round(
      soil * 0.4 + humidity * 0.3 + (30 - Math.abs(24 - temp)) * 0.3
    );

    let status = "";
    if (efficiency > 75) status = "🟢 Yüksek Performans";
    else if (efficiency > 50) status = "🟡 Orta Performans";
    else status = "🔴 Düşük Performans";

    setReport({
      avgTemp: temp.toFixed(1),
      avgHumidity: humidity.toFixed(0),
      avgSoil: soil.toFixed(0),
      efficiency,
      status,
    });
  }, []);

  /* ➕ NOTE EKLE (SADECE ADMIN) */
  const addNote = () => {
    if (!isAdmin) return;
    if (!note.trim()) return;

    const newNote = {
      id: Date.now(),
      text: note,
      user: user?.email,
      date: new Date().toLocaleString(),
    };

    setNotes([newNote, ...notes]);
    setNote("");
  };

  /* ❌ NOTE SİL (SADECE ADMIN) */
  const deleteNote = (id) => {
    if (!isAdmin) return;

    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <MainLayout>
      <div style={styles.page}>
        <div style={styles.overlay}></div>

        <div style={styles.container}>
          <h1>📊 Rapor & Analiz Paneli</h1>

          <p style={styles.user}>Kullanıcı: {user?.email}</p>

          {/* 📈 CARDS */}
          <div style={styles.grid}>
            <Card title="🌡 Sıcaklık" value={report.avgTemp + "°C"} />
            <Card title="💧 Nem" value={"%" + report.avgHumidity} />
            <Card title="🌱 Toprak" value={"%" + report.avgSoil} />
            <Card title="📈 Verim" value={"%" + report.efficiency} />
          </div>

          {/* STATUS */}
          <div style={styles.status}>{report.status}</div>

          {/* 🧠 ANALYSIS */}
          <div style={styles.analysis}>
            <h3>Sistem Analizi</h3>
            <p>
              Sistem verileri otomatik olarak analiz edilmektedir ve genel
              performans değerlendirmesi yapılmaktadır.
            </p>
          </div>

          {/* 📝 NOTE PANEL (SADECE ADMIN) */}
          {isAdmin && (
            <div style={styles.noteBox}>
              <h3>📝 Yönetici Notları</h3>

              <div style={styles.noteInput}>
                <input
                  style={styles.input}
                  placeholder="Not yaz..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button style={styles.button} onClick={addNote}>
                  Ekle
                </button>
              </div>

              {/* NOTES LIST */}
              {notes.map((n) => (
                <div key={n.id} style={styles.noteCard}>
                  <div>
                    <p>{n.text}</p>
                    <small>
                      👤 {n.user} • {n.date}
                    </small>
                  </div>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteNote(n.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

/* CARD */
function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardValue}>{value}</div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.68)",
  },

  container: {
    position: "relative",
    zIndex: 2,
    padding: "25px",
    color: "#f1f5f9",
  },

  user: {
    color: "#cbd5e1",
    marginBottom: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
  },

  card: {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(10px)",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  cardTitle: { fontSize: "12px", color: "#cbd5e1" },
  cardValue: { fontSize: "20px", fontWeight: "bold", marginTop: "6px" },

  status: {
    marginTop: "15px",
    background: "rgba(34,197,94,0.15)",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(34,197,94,0.3)",
  },

  analysis: {
    marginTop: "15px",
    background: "rgba(255,255,255,0.07)",
    padding: "15px",
    borderRadius: "14px",
  },

  noteBox: {
    marginTop: "20px",
    background: "rgba(255,255,255,0.07)",
    padding: "15px",
    borderRadius: "14px",
  },

  noteInput: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  button: {
    padding: "10px 15px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "white",
    cursor: "pointer",
  },

  noteCard: {
    display: "flex",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.05)",
    padding: "10px",
    borderRadius: "10px",
    marginTop: "10px",
  },

  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontSize: "18px",
    cursor: "pointer",
  },
};