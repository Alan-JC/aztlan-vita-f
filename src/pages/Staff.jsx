import { useState } from "react";
import { useApp } from "../context/AppContext";
import { analizarFlujo } from "../services/gemini";

const ESTADO_COLOR = {
  en_espera: { bg: "#fef9c3", text: "#854d0e", label: "En espera" },
  en_proceso: { bg: "#dbeafe", text: "#1e40af", label: "En proceso" },
  completado: { bg: "#dcfce7", text: "#166534", label: "Completado" },
};

export default function Staff() {
  const { pacientes, avanzarEstudio, iniciarEstudio, limpiarCompletados } = useApp();
  const [sugerenciaIA, setSugerenciaIA] = useState("");
  const [cargandoIA, setCargandoIA] = useState(false);

  const activos = pacientes.filter((p) => p.estado !== "completado");
  const completados = pacientes.filter((p) => p.estado === "completado");
  const enProceso = pacientes.filter((p) => p.estado === "en_proceso").length;
  const enEspera = pacientes.filter((p) => p.estado === "en_espera").length;

  async function handleAnalizar() {
    setCargandoIA(true);
    setSugerenciaIA("");
    try {
      const resumen = pacientes.map((p) => ({
        nombre: p.nombre,
        estado: p.estado,
        estudios: p.estudios.map((e) => `${e.nombre}(${e.estado})`).join(", "),
      }));
      const texto = await analizarFlujo(resumen);
      setSugerenciaIA(texto);
    } catch (e) {
      setSugerenciaIA("Error al analizar. Intenta de nuevo.");
    }
    setCargandoIA(false);
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0e7490" }}>👨‍⚕️ Panel del Staff</h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Gestión de pacientes en tiempo real</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleAnalizar} disabled={cargandoIA || pacientes.length === 0} style={{
            padding: "10px 18px", borderRadius: "10px", border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            color: "white", fontWeight: 700, fontSize: "13px",
            opacity: cargandoIA || pacientes.length === 0 ? 0.6 : 1,
          }}>
            {cargandoIA ? "Analizando..." : "✨ Analizar con IA"}
          </button>
          {completados.length > 0 && (
            <button onClick={limpiarCompletados} style={{
              padding: "10px 18px", borderRadius: "10px", border: "1px solid #e2e8f0",
              background: "white", color: "#64748b", fontWeight: 600, fontSize: "13px", cursor: "pointer",
            }}>
              Limpiar completados
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total pacientes", valor: pacientes.length, color: "#0891b2" },
          { label: "En espera", valor: enEspera, color: "#d97706" },
          { label: "En proceso", valor: enProceso, color: "#2563eb" },
          { label: "Completados hoy", valor: completados.length, color: "#059669" },
        ].map((m) => (
          <div key={m.label} style={{
            background: "white", borderRadius: "14px", padding: "16px 20px",
            border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}>
            <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: "6px" }}>{m.label}</p>
            <p style={{ fontSize: "28px", fontWeight: 800, color: m.color }}>{m.valor}</p>
          </div>
        ))}
      </div>

      {sugerenciaIA && (
        <div style={{
          background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
          border: "1px solid #c4b5fd", borderRadius: "16px",
          padding: "20px", marginBottom: "24px",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#7c3aed", marginBottom: "8px" }}>✨ Análisis IA del flujo actual</p>
          <p style={{ fontSize: "14px", color: "#4c1d95", lineHeight: 1.6, whiteSpace: "pre-line" }}>{sugerenciaIA}</p>
        </div>
      )}

      {activos.length === 0 ? (
        <div style={{
          background: "white", borderRadius: "20px", padding: "48px",
          textAlign: "center", border: "1px solid #e2e8f0",
        }}>
          <p style={{ fontSize: "48px", marginBottom: "12px" }}>🏥</p>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#64748b" }}>No hay pacientes activos</p>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>Registra pacientes desde el Kiosco</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {activos.map((p) => {
            const estudioActual = p.estudios.find((e) => e.estado === "en_espera" || e.estado === "en_proceso");
            const completadosP = p.estudios.filter((e) => e.estado === "completado").length;
            const progresoP = Math.round((completadosP / p.estudios.length) * 100);
            return (
              <div key={p.codigo} style={{
                background: "white", borderRadius: "16px", padding: "20px",
                border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: "linear-gradient(135deg, #0e7490, #06b6d4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: 800, fontSize: "16px", flexShrink: 0,
                    }}>
                      {p.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>{p.nombre}</p>
                      <p style={{ fontSize: "12px", color: "#94a3b8" }}>{p.codigo} · {p.edad} años · {p.sexo}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "12px", color: "#94a3b8" }}>Progreso</p>
                    <p style={{ fontSize: "18px", fontWeight: 800, color: "#0891b2" }}>{progresoP}%</p>
                  </div>
                </div>

                <div style={{ background: "#f1f5f9", borderRadius: "999px", height: "6px", marginBottom: "16px" }}>
                  <div style={{ height: "6px", borderRadius: "999px", background: "linear-gradient(90deg, #0e7490, #06b6d4)", width: `${progresoP}%`, transition: "width 0.5s" }} />
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {p.estudios.map((e, i) => {
                    const config = ESTADO_COLOR[e.estado] || ESTADO_COLOR.en_espera;
                    return (
                      <span key={i} style={{
                        padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600,
                        background: config.bg, color: config.text,
                      }}>
                        {e.nombre}
                      </span>
                    );
                  })}
                </div>

                {estudioActual && (
                  <div style={{
                    background: "#f8fafc", borderRadius: "12px", padding: "12px 16px",
                    marginBottom: "16px", border: "1px solid #e2e8f0",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>ESTUDIO ACTUAL</p>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{estudioActual.nombre}</p>
                      <p style={{ fontSize: "12px", color: "#64748b" }}>{estudioActual.area}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {estudioActual.estado === "en_espera" && (
                        <button onClick={() => iniciarEstudio(p.codigo)} style={{
                          padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                          background: "#dbeafe", color: "#1e40af", fontWeight: 700, fontSize: "12px",
                        }}>
                          ▶ Iniciar
                        </button>
                      )}
                      <button onClick={() => avanzarEstudio(p.codigo)} style={{
                        padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                        background: "linear-gradient(135deg, #059669, #10b981)",
                        color: "white", fontWeight: 700, fontSize: "12px",
                      }}>
                        ✓ Completar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {completados.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#64748b", marginBottom: "12px" }}>Completados hoy ({completados.length})</p>
          <div style={{ display: "grid", gap: "8px" }}>
            {completados.map((p) => (
              <div key={p.codigo} style={{
                background: "#f0fdf4", borderRadius: "12px", padding: "14px 18px",
                border: "1px solid #bbf7d0", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#166534" }}>{p.nombre}</p>
                  <p style={{ fontSize: "12px", color: "#4ade80" }}>{p.codigo} · {p.estudios.length} estudios completados</p>
                </div>
                <span style={{ fontSize: "20px" }}>✅</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}