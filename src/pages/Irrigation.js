import { useState, useEffect, useRef } from "react";
import MainLayout from "../components/MainLayout";
import { getSession } from "../services/auth";
import { getSuggestion } from "../services/suggestion";

export default function Irrigation() {
  const user = getSession();

  const STORAGE_KEY = "irrigation_state";

  const [soil, setSoil] = useState(0);
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);

  const [suggestion, setSuggestion] = useState(getSuggestion());

  const [autoIrrigation, setAutoIrrigation] = useState(false);
  const [manualIrrigation, setManualIrrigation] = useState(false);

  const [autoTimeLeft, setAutoTimeLeft] = useState(null);
  const [manualTimeLeft, setManualTimeLeft] = useState(null);

  const [selectedTime, setSelectedTime] = useState(1);

  /* REF */
  const selectedTimeRef = useRef(1);
  const soilRef = useRef(0);
  
  useEffect(() => {
    selectedTimeRef.current = selectedTime;
  }, [selectedTime]);

  useEffect(() => {
    soilRef.current = soil;
  }, [soil]);

  /* 🌱 SENSOR */
  useEffect(() => {
    const interval = setInterval(() => {
      const value = Math.floor(20 + Math.random() * 60);
      setSoil(value);

      if (value < 30) setStatus("🚨 Sulama Gerekli");
      else if (value < 50) setStatus("⚠️ Takip Edilmeli");
      else setStatus("✅ Yeterli Nem");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* 💾 SAYFADAN ÇIKINCA KALMASI İÇİN */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      setAutoIrrigation(parsed.autoIrrigation);
      setManualIrrigation(parsed.manualIrrigation);
      setAutoTimeLeft(parsed.autoTimeLeft);
      setManualTimeLeft(parsed.manualTimeLeft);
    }
  }, []);

  /* 💾 HER DEĞİŞİKLİKTE KAYDET */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        autoIrrigation,
        manualIrrigation,
        autoTimeLeft,
        manualTimeLeft,
      })
    );
  }, [autoIrrigation, manualIrrigation, autoTimeLeft, manualTimeLeft]);

  /* 🤖 OTOMATİK */
  useEffect(() => {
    if (suggestion?.status === "ACCEPTED" && !autoIrrigation) {
      setAutoIrrigation(true);
      setAutoTimeLeft(selectedTimeRef.current * 60);

      setLogs((prev) => [
        {
          id: Date.now(),
          user: "Sistem",
          time: new Date().toLocaleString(),
          soilBefore: soilRef.current,
          status: `🤖 Otomatik Sulama BAŞLADI (${selectedTimeRef.current} dk)`,
        },
        ...prev,
      ]);

      setSuggestion(null);
    }
  }, [suggestion, autoIrrigation]);

  /* ⏳ OTOMATİK TIMER */
  useEffect(() => {
    if (!autoIrrigation || autoTimeLeft === null) return;

    const interval = setInterval(() => {
      setAutoTimeLeft((prev) => {
        if (prev <= 1) {
          setAutoIrrigation(false);
          alert("⛔ Otomatik sulama bitti");
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }

        if (prev === Math.floor((selectedTimeRef.current * 60) * 0.2)) {
          alert("⚠️ Otomatik sulama bitmek üzere!");
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoIrrigation, autoTimeLeft]);

  /* 💧 MANUEL */
  const toggleManualIrrigation = () => {
    if (!manualIrrigation) {
      setManualIrrigation(true);
      setManualTimeLeft(selectedTimeRef.current * 60);

      setLogs((prev) => [
        {
          id: Date.now(),
          user: user?.email,
          time: new Date().toLocaleString(),
          soilBefore: soilRef.current,
          status: `💧 Manuel Sulama BAŞLADI (${selectedTimeRef.current} dk)`,
        },
        ...prev,
      ]);
    } else {
      setManualIrrigation(false);
      setManualTimeLeft(null);

      setLogs((prev) => [
        {
          id: Date.now(),
          user: user?.email,
          time: new Date().toLocaleString(),
          soilBefore: soilRef.current,
          status: "⛔ Manuel Sulama KAPATILDI",
        },
        ...prev,
      ]);
    }
  };

  /* ⏳ MANUEL TIMER */
  useEffect(() => {
    if (!manualIrrigation || manualTimeLeft === null) return;

    const interval = setInterval(() => {
      setManualTimeLeft((prev) => {
        if (prev <= 1) {
          setManualIrrigation(false);
          alert("⛔ Manuel sulama bitti");
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }

        if (prev === Math.floor((selectedTimeRef.current * 60) * 0.2)) {
          alert("⚠️ Manuel sulama bitmek üzere!");
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [manualIrrigation, manualTimeLeft]);

  return (
    <MainLayout>
      <div style={styles.page}>
        <div style={styles.overlay}></div>

        <div style={styles.container}>
          <h1>💧 Sulama Kontrol Sistemi</h1>

          <div style={styles.card}>
            <p>🌱 Toprak Nem Seviyesi</p>
            <h2>%{soil}</h2>
            <p style={styles.status}>{status}</p>

            <p>🤖 Otomatik: <b>{autoIrrigation ? "AÇIK" : "KAPALI"}</b></p>
            <p>💧 Manuel: <b>{manualIrrigation ? "AÇIK" : "KAPALI"}</b></p>

            <p>⏰ Süre: {selectedTime} dk</p>

            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(Number(e.target.value))}
            >
              <option value={1}>1 dk</option>
              <option value={3}>3 dk</option>
              <option value={5}>5 dk</option>
              <option value={10}>10 dk</option>
            </select>

            {autoTimeLeft && <p>🤖 Kalan: {autoTimeLeft} sn</p>}
            {manualTimeLeft && <p>💧 Kalan: {manualTimeLeft} sn</p>}
          </div>

          <button
            onClick={toggleManualIrrigation}
            style={{
              ...styles.button,
              background: manualIrrigation ? "#ef4444" : "#3b82f6",
              marginBottom: 10,
            }}
          >
            {manualIrrigation ? "⛔ Manuel Kapat" : "💧 Manuel Başlat"}
          </button>

          <h3 style={{ marginTop: 20 }}>📜 İşlem Geçmişi</h3>

          {logs.map((l) => (
            <div key={l.id} style={styles.log}>
              <p style={{ margin: 0 }}>{l.status}</p>
              <small>⏱ {l.time}</small>
              <br />
              <small>👤 {l.user}</small>
              <br />
              <small>🌱 Nem: %{l.soilBefore}</small>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

/* 🎨 STYLES (TEKRAR EKLENDİ - BU ÇOK ÖNEMLİ) */
const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80')",
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
    padding: "25px",
    color: "#f1f5f9",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "15px",
  },

  status: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#e2e8f0",
  },

  button: {
    padding: "12px 18px",
    border: "none",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  log: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "12px",
    borderRadius: "10px",
    marginTop: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e2e8f0",
  },
};