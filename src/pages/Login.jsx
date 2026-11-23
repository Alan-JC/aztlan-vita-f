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
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand"><span>AV</span><div><strong>Aztlán Vita F</strong><small>Plataforma de atención</small></div></div>
        <div className="login-content">
          <span className="section-kicker">ACCESO AL SISTEMA</span>
          <h1>Bienvenido</h1>
          <p>Ingresa tus datos para continuar al panel de operación.</p>
          <form onSubmit={handleEntrar}>
            <div className="login-field"><label>Nombre</label><input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" autoComplete="name" /></div>
            <div className="login-field"><label>Correo electrónico</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="nombre@correo.com" autoComplete="email" /></div>
            <button type="submit">Continuar <span>→</span></button>
          </form>
          <div className="demo-notice"><span>i</span><p>Acceso de demostración. Este formulario no valida identidades ni sustituye un sistema de autenticación.</p></div>
        </div>
        <footer>AZTLÁN VITA F <span>·</span> PROTOTIPO</footer>
      </section>
      <aside className="login-aside"><div className="aside-orbit orbit-a" /><div className="aside-orbit orbit-b" /><div className="aside-message"><span>ATENCIÓN CONECTADA</span><h2>Una mejor experiencia comienza con un seguimiento claro.</h2><p>Herramientas para acompañar cada etapa de la visita.</p></div><div className="aside-bottom">GESTIÓN · SEGUIMIENTO · EXPERIENCIA</div></aside>
      <style>{`
        .login-page { min-height: 100vh; display: grid; grid-template-columns: minmax(380px, 1fr) minmax(350px, 1fr); background: white; }.login-panel { min-height: 100vh; display: flex; flex-direction: column; padding: 34px clamp(25px, 7vw, 100px); }.login-brand { display: flex; align-items: center; gap: 11px; }.login-brand > span { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; background: #087f8c; color: white; font: 800 13px 'Manrope', sans-serif; }.login-brand div { display: flex; flex-direction: column; gap: 2px; }.login-brand strong { color: #18333a; font: 800 14px 'Manrope', sans-serif; }.login-brand small { color: #829397; font-size: 10px; }.login-content { width: 100%; max-width: 390px; margin: auto; padding: 55px 0; }.login-content h1 { margin: 9px 0 7px; font: 800 31px 'Manrope', sans-serif; letter-spacing: -.8px; }.login-content > p { margin-bottom: 29px; color: #829397; font-size: 12px; line-height: 1.7; }.login-field { margin-bottom: 17px; }.login-field label { display: block; margin-bottom: 7px; color: #476166; font-size: 11px; font-weight: 700; }.login-field input { width: 100%; min-height: 46px; padding: 12px 13px; border: 1px solid #dce8e8; border-radius: 10px; background: #fbfdfd; color: #18333a; font-size: 12px; }.login-field input:focus { outline: 3px solid rgba(8,127,140,.12); border-color: #65afb0; }.login-content form button { width: 100%; min-height: 46px; display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding: 0 16px; border: 0; border-radius: 10px; background: #087f8c; color: white; font-size: 12px; font-weight: 700; cursor: pointer; }.login-content form button:hover { background: #075b66; }.login-content form button span { font-size: 17px; }.demo-notice { display: flex; gap: 9px; margin-top: 20px; padding: 12px; border: 1px solid #e5e9d8; border-radius: 10px; background: #fbfcf5; }.demo-notice > span { width: 18px; height: 18px; flex: 0 0 18px; display: grid; place-items: center; border-radius: 50%; background: #f0f1df; color: #8c8a54; font-size: 10px; font-weight: 700; }.demo-notice p { color: #858a70; font-size: 9px; line-height: 1.6; }.login-panel footer { color: #9aa9ab; font-size: 8px; font-weight: 700; letter-spacing: 1.3px; }.login-panel footer span { margin: 0 5px; }
        .login-aside { position: relative; display: flex; flex-direction: column; justify-content: center; overflow: hidden; padding: 60px clamp(35px, 7vw, 100px); background: #075b66; color: white; }.aside-orbit { position: absolute; border: 1px solid rgba(155,216,210,.2); border-radius: 50%; }.orbit-a { width: 520px; height: 520px; top: 8%; left: 22%; }.orbit-b { width: 360px; height: 360px; top: 23%; left: 37%; border-color: rgba(155,216,210,.13); }.aside-message { position: relative; z-index: 1; max-width: 430px; }.aside-message > span { color: #9bd8d2; font-size: 9px; font-weight: 700; letter-spacing: 2px; }.aside-message h2 { margin: 17px 0 13px; color: white; font: 800 clamp(27px, 3.2vw, 39px)/1.2 'Manrope', sans-serif; letter-spacing: -1.2px; }.aside-message p { color: #c5e1df; font-size: 12px; line-height: 1.8; }.aside-bottom { position: absolute; bottom: 32px; left: clamp(35px, 7vw, 100px); color: rgba(197,225,223,.65); font-size: 8px; letter-spacing: 1.8px; }
        @media(max-width:800px) { .login-page { grid-template-columns: 1fr; }.login-panel { min-height: 100vh; padding: 25px 28px; }.login-content { margin: auto; }.login-aside { display: none; } }
      `}</style>
    </main>
  );
}
