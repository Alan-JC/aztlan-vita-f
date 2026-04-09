import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Home() {
  const { pacientes } = useApp();
  const activos = pacientes.filter((p) => p.estado !== "completado").length;
  const completados = pacientes.filter((p) => p.estado === "completado").length;
  const enProceso = pacientes.filter((p) => p.estado === "en_proceso").length;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{
        background: "linear-gradient(135deg, #0e7490, #06b6d4)",
        borderRadius: "24px", padding: "36px 40px",
        marginBottom: "32px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.2)", borderRadius: "999px",
            padding: "4px 12px", marginBottom: "16px",
          }}>
            <span style={{ width: "6px", height: "6px", background: "#4ade80", borderRadius: "50%", display: "inline-block" }}></span>
            <p style={{ color: "white", fontSize: "12px", fontWeight: 600 }}>Sistema activo · Talent Hackathon 2026</p>
          </div>
          <h1 style={{ color: "white", fontSize: "36px", fontWeight: 800, marginBottom: "12px", lineHeight: 1.2 }}>
            El Uber de la<br />atención médica
          </h1>
          <p style={{ color: "#cffafe", fontSize: "16px", maxWidth: "500px", lineHeight: 1.6, marginBottom: "24px" }}>
            Acompaña al paciente en cada paso de su visita a Salud Digna. Tracking en tiempo real, IA predictiva y cero incertidumbre.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/kiosco" style={{
              background: "white", color: "#0e7490", padding: "12px 24px",
              borderRadius: "12px", fontWeight: 700, fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
              🏥 Registrar paciente
            </Link>
            <Link to="/staff" style={{
              background: "rgba(255,255,255,0.2)", color: "white",
              padding: "12px 24px", borderRadius: "12px",
              fontWeight: 700, fontSize: "14px", border: "1px solid rgba(255,255,255,0.3)",
            }}>
              👨‍⚕️ Panel Staff
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Pacientes activos", valor: activos, color: "#0891b2", emoji: "👥" },
          { label: "En proceso", valor: enProceso, color: "#2563eb", emoji: "🔬" },
          { label: "Completados hoy", valor: completados, color: "#059669", emoji: "✅" },
        ].map((m) => (
          <div key={m.label} style={{
            background: "white", borderRadius: "16px", padding: "20px",
            border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "28px", marginBottom: "8px" }}>{m.emoji}</p>
            <p style={{ fontSize: "32px", fontWeight: 800, color: m.color }}>{m.valor}</p>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{m.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { to: "/kiosco", emoji: "🏥", titulo: "Kiosco de Registro", desc: "Registra al paciente, selecciona sus estudios y genera su código QR de seguimiento.", color: "#ecfeff", border: "#a5f3fc", btn: "#0e7490" },
          { to: "/staff", emoji: "👨‍⚕️", titulo: "Panel del Staff", desc: "Gestiona el flujo de pacientes, actualiza estados y recibe análisis predictivos con IA.", color: "#f5f3ff", border: "#c4b5fd", btn: "#7c3aed" },
        ].map((m) => (
          <div key={m.to} style={{
            background: m.color, border: `1px solid ${m.border}`,
            borderRadius: "20px", padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}>
            <p style={{ fontSize: "36px", marginBottom: "12px" }}>{m.emoji}</p>
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>{m.titulo}</h2>
            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, marginBottom: "20px" }}>{m.desc}</p>
            <Link to={m.to} style={{
              display: "inline-block", background: m.btn, color: "white",
              padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600,
            }}>
              Abrir →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}