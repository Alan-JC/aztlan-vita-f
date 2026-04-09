import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "🏠 Inicio" },
  { to: "/kiosco", label: "🏥 Kiosco" },
  { to: "/staff", label: "👨‍⚕️ Staff" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav style={{
      background: "linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)",
      padding: "0 40px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: "white", padding: "5px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)", flexShrink: 0,
        }}>
          <img src="/aztlan-logo.JPG" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div>
          <p style={{ color: "white", fontWeight: 800, fontSize: "18px", lineHeight: 1 }}>Aztlan Vita F</p>
          <p style={{ color: "#a5f3fc", fontSize: "11px", marginTop: "3px" }}>Salud Digna · Atención 360°</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} style={{
            padding: "8px 16px", borderRadius: "8px", fontSize: "13px",
            fontWeight: pathname === l.to ? 700 : 500,
            color: pathname === l.to ? "#0e7490" : "white",
            background: pathname === l.to ? "white" : "rgba(255,255,255,0.1)",
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}