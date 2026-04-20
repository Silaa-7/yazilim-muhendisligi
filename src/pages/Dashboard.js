import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { getSession } from "../services/auth";
import { analyzeSensors } from "../services/alerts";

import {
  createSuggestion,
  getSuggestion,
  acceptSuggestion,
  rejectSuggestion,
} from "../services/suggestion";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const user = getSession();

  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [suggestion, setSuggestion] = useState(getSuggestion());
  const [input, setInput] = useState("");

  const isManager = user?.email === "manager@test.com";
  const isFarmer = user?.email === "farmer@test.com";

  useEffect(() => {
    const today = new Date();

    const labels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() + i);

      return d.toLocaleDateString("tr-TR", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      });
    });

    const temperature = labels.map(() => Math.floor(18 + Math.random() * 18));
    const humidity = labels.map(() => Math.floor(30 + Math.random() * 60));
    const soil = labels.map(() => Math.floor(20 + Math.random() * 55));

    const yieldData = labels.map(() =>
      Math.floor(40 + Math.random() * 60)
    );

    setData({
      labels,
      temperature,
      humidity,
      soil,
      yieldData,
    });

    const todaySensor = {
      temperature: temperature[0],
      humidity: humidity[0],
      soil: soil[0],
    };

    setAlerts(analyzeSensors(todaySensor));
  }, []);

  const handleCreateSuggestion = () => {
    if (!isManager) return;
    if (!input.trim()) return;

    const s = createSuggestion(input, user?.email);
    setSuggestion({ ...s });
    setInput("");
  };

  const handleAccept = () => {
    if (!isFarmer) return;
    const s = acceptSuggestion();
    setSuggestion({ ...s });
  };

  const handleReject = () => {
    if (!isFarmer) return;
    const s = rejectSuggestion();
    setSuggestion({ ...s });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  if (!data) return <MainLayout>Yükleniyor...</MainLayout>;

  return (
    <MainLayout>
      <div style={styles.page}>
        <h2>📊 Akıllı Sera Dashboard</h2>
        <p>Giriş: {user?.email}</p>

        {/* ALERT */}
        <div style={styles.alertBox}>
          {alerts.map((a, i) => (
            <div key={i}>{a}</div>
          ))}
        </div>

        {/* 🌤 BUGÜNÜN VERİLERİ (YENİ EKLENDİ) */}
        <div style={styles.todayBox}>
          <h4>📍 Bugünün Verileri</h4>
          <p>🌡 Sıcaklık: {data.temperature[0]} °C</p>
          <p>💧 Nem: {data.humidity[0]} %</p>
          <p>🌱 Toprak Nem: {data.soil[0]} %</p>
        </div>

        {/* MANAGER SUGGESTION */}
        {isManager && (
          <div style={styles.suggestionBox}>
            <h4>🌱 Öneri Yaz</h4>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Öneri yaz..."
              style={{ padding: 8, width: "70%" }}
            />

            <button onClick={handleCreateSuggestion} style={styles.btnGreen}>
              Gönder
            </button>
          </div>
        )}

        {/* SUGGESTION DISPLAY */}
        {suggestion && (
          <div style={styles.suggestionBox}>
            <p>💬 {suggestion.message}</p>
            <p>Durum: {suggestion.status}</p>

            {isFarmer && suggestion.status === "PENDING" && (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleAccept} style={styles.btnGreen}>
                  ✔ Kabul
                </button>
                <button onClick={handleReject} style={styles.btnRed}>
                  ✖ Reddet
                </button>
              </div>
            )}
          </div>
        )}

        {/* 📊 GRAFİKLER */}
        <div style={styles.grid}>
          <Card title="🌡 Sıcaklık">
            <Line
              data={{
                labels: data.labels,
                datasets: [
                  {
                    label: "°C",
                    data: data.temperature,
                    borderColor: "red",
                  },
                ],
              }}
              options={options}
            />
          </Card>

          <Card title="💧 Nem">
            <Bar
              data={{
                labels: data.labels,
                datasets: [
                  {
                    label: "%",
                    data: data.humidity,
                    backgroundColor: "blue",
                  },
                ],
              }}
              options={options}
            />
          </Card>

          <Card title="🌱 Toprak Nem">
            <Line
              data={{
                labels: data.labels,
                datasets: [
                  {
                    label: "%",
                    data: data.soil,
                    borderColor: "green",
                  },
                ],
              }}
              options={options}
            />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

function Card({ title, children }) {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <div style={{ height: 200 }}>{children}</div>
    </div>
  );
}

const styles = {
  page: { padding: 20, color: "white" },
  alertBox: { padding: 10, background: "#222", marginBottom: 10 },
  suggestionBox: { padding: 10, background: "#1e293b", marginBottom: 10 },

  // ✅ YENİ EKLENDİ
  todayBox: {
    padding: 10,
    background: "#0f172a",
    marginBottom: 10,
    border: "1px solid #334155",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 10,
  },
  card: {
    background: "#111",
    padding: 10,
  },
  btnGreen: { background: "green", color: "white", marginRight: 5 },
  btnRed: { background: "red", color: "white" },
};