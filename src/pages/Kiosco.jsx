import { useState } from "react";
import { useApp } from "../context/AppContext";
import { QRCodeSVG } from "qrcode.react";

export default function Kiosco() {
  const { registrarPaciente, estudiosDisponibles } = useApp();
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({ nombre: "", edad: "", sexo: "", telefono: "", estudios: [] });
  const [pacienteRegistrado, setPacienteRegistrado] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleEstudio(id) {
    const lista = form.estudios;
    setForm({
      ...form,
      estudios: lista.includes(id) ? lista.filter((e) => e !== id) : [...lista, id],
    });
  }

  function handleRegistrar() {
    if (!form.nombre || !form.edad || form.estudios.length === 0) {
      alert("Completa nombre, edad y selecciona al menos un estudio.");
      return;
    }
    const paciente = registrarPaciente(form);
    setPacienteRegistrado(paciente);
    setPaso(3);
  }

  function handleNuevo() {
    setForm({ nombre: "", edad: "", sexo: "", telefono: "", estudios: [] });
    setPacienteRegistrado(null);
    setPaso(1);
  }

  const urlPaciente = pacienteRegistrado
  ? `http://192.168.100.19:5173/paciente/${pacienteRegistrado.codigo}`
  : "";

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0e7490" }}>🏥 Kiosco de Registro</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Registra al paciente y genera su código de seguimiento</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {["Datos del paciente", "Estudios solicitados", "Código QR"].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              height: "4px", borderRadius: "2px", marginBottom: "6px",
              background: paso > i + 1 ? "#059669" : paso === i + 1 ? "#06b6d4" : "#e2e8f0",
            }} />
            <p style={{ fontSize: "11px", fontWeight: 600, color: paso === i + 1 ? "#0e7490" : "#94a3b8" }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>

        {paso === 1 && (
          <div>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", marginBottom: "20px" }}>Información del paciente</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Nombre completo</label>
                <input name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Ej: María García López" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Edad</label>
                <input name="edad" type="number" value={form.edad} onChange={handleChange}
                  placeholder="35" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Sexo</label>
                <select name="sexo" value={form.sexo} onChange={handleChange} style={inputStyle}>
                  <option value="">Seleccionar</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Teléfono (opcional)</label>
                <input name="telefono" value={form.telefono} onChange={handleChange}
                  placeholder="55 1234 5678" style={inputStyle} />
              </div>
            </div>
            <button onClick={() => {
              if (!form.nombre || !form.edad) return alert("Nombre y edad son obligatorios.");
              setPaso(2);
            }} style={btnStyle}>
              Siguiente →
            </button>
          </div>
        )}

        {paso === 2 && (
          <div>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", marginBottom: "20px" }}>Selecciona los estudios</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              {estudiosDisponibles.map((e) => {
                const seleccionado = form.estudios.includes(e.id);
                return (
                  <div key={e.id} onClick={() => toggleEstudio(e.id)} style={{
                    padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
                    border: `2px solid ${seleccionado ? "#06b6d4" : "#e2e8f0"}`,
                    background: seleccionado ? "#ecfeff" : "white",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: seleccionado ? "#0e7490" : "#1e293b" }}>{e.nombre}</p>
                      <span style={{
                        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                        background: seleccionado ? "#06b6d4" : "#e2e8f0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {seleccionado && <span style={{ color: "white", fontSize: "11px" }}>✓</span>}
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{e.area} · ~{e.duracion} min</p>
                    <p style={{ fontSize: "11px", color: "#f97316", marginTop: "4px" }}>⚠ {e.instruccion}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setPaso(1)} style={{ ...btnStyle, background: "#f1f5f9", color: "#64748b", boxShadow: "none", flex: 0.4 }}>
                ← Atrás
              </button>
              <button onClick={handleRegistrar} style={{ ...btnStyle, flex: 1 }}>
                Registrar y generar QR →
              </button>
            </div>
          </div>
        )}

        {paso === 3 && pacienteRegistrado && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "#dcfce7", margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px",
            }}>✅</div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#059669", marginBottom: "4px" }}>
              ¡Paciente registrado!
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>
              {pacienteRegistrado.nombre}
            </p>
            <div style={{
              display: "inline-block", background: "#f0f9ff", border: "2px dashed #06b6d4",
              borderRadius: "12px", padding: "8px 20px", marginBottom: "24px",
            }}>
              <p style={{ fontSize: "24px", fontWeight: 800, color: "#0e7490", letterSpacing: "2px" }}>
                {pacienteRegistrado.codigo}
              </p>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px", fontWeight: 600 }}>
                Escanea el QR para seguir tu visita
              </p>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <QRCodeSVG value={urlPaciente} size={180} />
              </div>
              <p style={{ fontSize: "11px", color: "#94a3b8", wordBreak: "break-all" }}>{urlPaciente}</p>
            </div>

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "10px" }}>Estudios programados:</p>
              {pacienteRegistrado.estudios.map((e, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 14px", borderRadius: "10px", marginBottom: "8px",
                  background: i === 0 ? "#ecfeff" : "#f8fafc",
                  border: `1px solid ${i === 0 ? "#a5f3fc" : "#e2e8f0"}`,
                }}>
                  <span style={{
                    width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                    background: i === 0 ? "#06b6d4" : "#e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, color: i === 0 ? "white" : "#94a3b8",
                  }}>{i + 1}</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{e.nombre}</p>
                    <p style={{ fontSize: "11px", color: "#64748b" }}>{e.area} · ~{e.duracion} min</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleNuevo} style={btnStyle}>
              Registrar nuevo paciente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" };
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", outline: "none", background: "#f8fafc" };
const btnStyle = { width: "100%", padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg, #0e7490, #06b6d4)", color: "white", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(6,182,212,0.3)" };