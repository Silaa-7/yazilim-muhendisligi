import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function MainLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // 👈 girişe at
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🌿 Tarım Sistemi</div>

        <NavItem to="/" label="Dashboard" icon="📊" />
        <NavItem to="/activities" label="İşlemler" icon="🌱" />
        <NavItem to="/greenhouse" label="Sera" icon="🏡" />
        <NavItem to="/reports" label="Raporlar" icon="📈" />
        <NavItem to="/irrigation" label="Sulama"/>
        <NavItem to="/calendar" label="Ekim Takvimi"/>
        {/* 🚪 LOGOUT BUTTON */}
        <button onClick={handleLogout} style={styles.logout}>
          Çıkış Yap
        </button>
      </aside>

      <main style={styles.content}>{children}</main>
    </div>
  );
}

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.link,
        background: isActive ? "#1f2937" : "transparent",
        color: isActive ? "white" : "#9ca3af",
      })}
    >
      <span style={{ marginRight: 10 }}>{icon}</span>
      {label}
    </NavLink>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#0b1220",
    fontFamily: "system-ui",
  },

  sidebar: {
    width: "240px",
    background: "#0f172a",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  logo: {
    color: "white",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  link: {
    textDecoration: "none",
    padding: "10px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
  },

  logout: {
    marginTop: "auto",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  content: {
    flex: 1,
    padding: "20px",
    color: "white",
  },
};