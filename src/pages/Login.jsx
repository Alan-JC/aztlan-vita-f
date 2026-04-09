import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleEntrar(e) {
    e.preventDefault();
    if (!form.nombre || !form.email) return alert("Completa todos los campos.");
    localStorage.setItem("aztlan_staff", JSON.stringify(form));
    navigate("/");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ecfeff 0%, #cffafe 50%, #a5f3fc 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{
        background: "white", borderRadius: "24px", padding: "40px",
        width: "100%", maxWidth: "420px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            background: "linear-gradient(135deg, #0e7490, #06b6d4)",
            margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img src="/aztlan-logo.JPG" alt="Logo" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0e7490" }}>Aztlan Vita F</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>Salud Digna · Atención 360°</p>
        </div>

        <form onSubmit={handleEntrar}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange}
              placeholder="Tu nombre" style={inputStyle} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="tu@correo.com" style={inputStyle} />
          </div>
          <button type="submit" style={btnStyle}>Entrar al sistema →</button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" };
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", outline: "none", background: "#f8fafc" };
const btnStyle = { width: "100%", padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg, #0e7490, #06b6d4)", color: "white", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(6,182,212,0.4)" };