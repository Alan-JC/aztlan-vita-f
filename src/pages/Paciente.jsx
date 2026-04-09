import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { escucharPaciente } from "../services/firebase";

const ESTADO_CONFIG = {
  pendiente: { color: "#e2e8f0", texto: "#94a3b8", label: "Pendiente" },
  en_espera: { color: "#fef9c3", texto: "#854d0e", label: "En espera" },
  en_proceso: { color: "#dbeafe", texto: "#1e40af", label: "En proceso" },
  completado: { color: "#dcfce7", texto: "#166534", label: "Completado" },
};

export default function Paciente() {
  const { codigo } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsub = escucharPaciente(codigo, (data) => {
      setPaciente(data);
      setCargando(false);
    });
    return () => unsub();
  }, [codigo]);

  if (cargando) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f9ff" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</p>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#0e7490" }}>Cargando tu visita...</p>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f9ff" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</p>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#0e7490" }}>Código no encontrado</p>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "8px" }}>Verifica tu código con recepción</p>
        </div>
      </div>
    );
  }

  const estudioActual = paciente.estudios.find((e) => e.estado === "en_espera" || e.estado === "en_proceso");
  const completados = paciente.estudios.filter((e) => e.estado === "completado").length;
  const total = paciente.estudios.length;
  const progreso = Math.round((completados / total) * 100);
  const tiempoTotal = paciente.estudios.filter((e) => e.estado !== "completado").reduce((a, b) => a + b.duracion, 0);
  const todosCompletos = paciente.estado === "completado";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #ecfeff 0%, #f0f9ff 100%)" }}>
      <div style={{ background: "linear-gradient(135deg, #0e7490, #06b6d4)", padding: "24px 20px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.2)", padding: "4px" }}>
            <img src="/aztlan-logo.JPG" alt="Logo" style={{ width: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: "15px", lineHeight: 1 }}>Aztlan Vita F</p>
            <p style={{ color: "#a5f3fc", fontSize: "11px" }}>Tu visita en tiempo real</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: "999px" }}>
            <span style={{ width: "6px", height: "6px", background: "#4ade80", borderRadius: "50%", display: "inline-block" }}></span>
            <p style={{ color: "white", fontSize: "11px", fontWeight: 600 }}>En vivo</p>
          </div>
        </div>
        <p style={{ color: "#cffafe", fontSize: "13px", marginBottom: "4px" }}>Bienvenido,</p>
        <h1 style={{ color: "white", fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>{paciente.nombre}</h1>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "4px 14px" }}>
          <p style={{ color: "white", fontSize: "14px", fontWeight: 700, letterSpacing: "2px" }}>{paciente.codigo}</p>
        </div>
      </div>

      <div style={{ margin: "-40px 16px 0", position: "relative" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
          {todosCompletos ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <p style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</p>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#059669", marginBottom: "8px" }}>¡Visita completada!</h2>
              <p style={{ fontSize: "14px", color: "#64748b" }}>Todos tus estudios han sido realizados. Pasa a recepción por tus resultados.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>Progreso de tu visita</p>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#0891b2" }}>{progreso}%</p>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: "999px", height: "8px", marginBottom: "8px" }}>
                <div style={{ height: "8px", borderRadius: "999px", background: "linear-gradient(90deg, #0e7490, #06b6d4)", width: `${progreso}%`, transition: "width 0.5s" }} />
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>{completados} de {total} estudios · ~{tiempoTotal} min restantes</p>
            </>
          )}
        </div>

        {!todosCompletos && estudioActual && (
          <div style={{ background: "linear-gradient(135deg, #0e7490, #06b6d4)", borderRadius: "20px", padding: "20px", marginBottom: "16px", boxShadow: "0 8px 20px rgba(6,182,212,0.3)" }}>
            <p style={{ color: "#a5f3fc", fontSize: "11px", fontWeight: 600, marginBottom: "6px" }}>
              {estudioActual.estado === "en_proceso" ? "🔵 EN PROCESO AHORA" : "📍 SIGUIENTE PASO"}
            </p>
            <h2 style={{ color: "white", fontSize: "20px", fontWeight: 800, marginBottom: "14px" }}>{estudioActual.nombre}</h2>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 16px", marginBottom: "10px" }}>
              <p style={{ color: "#cffafe", fontSize: "11px", fontWeight: 600, marginBottom: "2px" }}>📍 Dirígete a</p>
              <p style={{ color: "white", fontSize: "16px", fontWeight: 700 }}>{estudioActual.area}</p>
            </div>
            <div style={{ background: "rgba(255,165,0,0.2)", borderRadius: "12px", padding: "12px 16px" }}>
              <p style={{ color: "#fde68a", fontSize: "11px", fontWeight: 600, marginBottom: "2px" }}>⚠️ Instrucción</p>
              <p style={{ color: "white", fontSize: "13px" }}>{estudioActual.instruccion}</p>
            </div>
          </div>
        )}

        <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginBottom: "16px" }}>Tu itinerario de hoy</p>
          {paciente.estudios.map((e, i) => {
            const config = ESTADO_CONFIG[e.estado] || ESTADO_CONFIG.pendiente;
            return (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: i < paciente.estudios.length - 1 ? "12px" : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                    background: config.color,
                    border: `2px solid ${e.estado === "en_proceso" ? "#06b6d4" : "transparent"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700, color: config.texto,
                  }}>
                    {e.estado === "completado" ? "✓" : i + 1}
                  </div>
                  {i < paciente.estudios.length - 1 && (
                    <div style={{ width: "2px", flex: 1, background: "#e2e8f0", margin: "4px 0", minHeight: "20px" }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: i < paciente.estudios.length - 1 ? "12px" : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: e.estado === "pendiente" ? "#94a3b8" : "#1e293b" }}>{e.nombre}</p>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: config.color, color: config.texto }}>
                      {config.label}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{e.area} · ~{e.duracion} min</p>
                </div>
              </div>
            );
          })}
        </div>

        {!todosCompletos && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "16px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#92400e", marginBottom: "4px" }}>💡 Mientras esperas</p>
            <p style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.6 }}>
              {estudioActual?.instruccion
                ? `Recuerda: ${estudioActual.instruccion}. Si tienes dudas acércate a recepción.`
                : "Tu visita está casi lista. Gracias por tu paciencia."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}