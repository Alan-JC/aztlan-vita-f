import { useState } from "react";
import { useApp } from "../context/AppContext";
import { QRCodeSVG } from "qrcode.react";

export default function Kiosco() {
  const { registrarPaciente, estudiosDisponibles } = useApp();
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({ nombre: "", edad: "", sexo: "", telefono: "", estudios: [] });
  const [pacienteRegistrado, setPacienteRegistrado] = useState(null);\n  const [errorRegistro, setErrorRegistro] = useState("");\n  const [guardando, setGuardando] = useState(false);

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

  async function handleRegistrar() {
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
    ? `${window.location.origin}/paciente/${pacienteRegistrado.codigo}`
    : "";

  return (
    <main className="kiosk-page">
      <header className="page-heading">
        <span className="section-kicker">REGISTRO DE PACIENTES</span>
        <h1>Kiosco de registro</h1>
        <p>Completa los datos y selecciona los estudios para generar el seguimiento de la visita.</p>
      </header>

      <div className="stepper" aria-label={`Paso ${paso} de 3`}>
        {["Datos del paciente", "Estudios solicitados", "Código QR"].map((label, i) => (
          <div className="step-item" key={label}>
            <div className={paso >= i + 1 ? "step-line reached" : "step-line"} />
            <span className={paso === i + 1 ? "step-label current" : paso > i + 1 ? "step-label done" : "step-label"}>{label}</span>
          </div>
        ))}
      </div>

      <section className="kiosk-card">
        {paso === 1 && (
          <div>
            <div className="form-section-title"><span>01</span><div><h2>Información del paciente</h2><p>Los campos marcados son necesarios para continuar.</p></div></div>
            <div className="form-grid">
              <div className="field full"><label>Nombre completo <b>*</b></label><input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej. María García López" autoComplete="name" /></div>
              <div className="field"><label>Edad <b>*</b></label><input name="edad" type="number" min="0" max="120" value={form.edad} onChange={handleChange} placeholder="Ej. 35" /></div>
              <div className="field"><label>Sexo</label><select name="sexo" value={form.sexo} onChange={handleChange}><option value="">Seleccionar</option><option value="femenino">Femenino</option><option value="masculino">Masculino</option><option value="otro">Otro</option></select></div>
              <div className="field full"><label>Teléfono <span>(opcional)</span></label><input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Número de contacto" autoComplete="tel" /></div>
            </div>
            <div className="form-actions"><button className="action-primary" onClick={() => { if (!form.nombre || !form.edad) return alert("Nombre y edad son obligatorios."); setPaso(2); }}>Continuar <span>→</span></button></div>
          </div>
        )}

        {paso === 2 && (
          <div>
            <div className="form-section-title"><span>02</span><div><h2>Estudios solicitados</h2><p>Selecciona todos los estudios indicados para esta visita.</p></div></div>
            <div className="study-grid">
              {estudiosDisponibles.map((e) => {
                const seleccionado = form.estudios.includes(e.id);
                return (
                  <button type="button" key={e.id} onClick={() => toggleEstudio(e.id)} className={seleccionado ? "study-option selected" : "study-option"} aria-pressed={seleccionado}>
                    <span className="study-check">{seleccionado ? "✓" : "+"}</span>
                    <strong>{e.nombre}</strong>
                    <small>{e.area} · aprox. {e.duracion} min</small>
                    <span className="study-instruction">Nota: {e.instruccion}</span>
                  </button>
                );
              })}
            </div>
            <p className="selection-count">{form.estudios.length} estudio(s) seleccionado(s)</p>{errorRegistro && <p role="alert" style={{ color: "#a33", fontSize: "12px", marginTop: "12px" }}>{errorRegistro}</p>}
            <div className="form-actions split">
              <button className="action-secondary" onClick={() => setPaso(1)}>← Atrás</button>
              <button className="action-primary" onClick={handleRegistrar} disabled={form.estudios.length === 0 || guardando}>{guardando ? "Guardando..." : "Registrar paciente"} <span>→</span></button>
            </div>
          </div>
        )}

        {paso === 3 && pacienteRegistrado && (
          <div className="success-view">
            <div className="success-mark">✓</div>
            <span className="section-kicker">REGISTRO COMPLETADO</span>
            <h2>Paciente registrado</h2>
            <p className="success-name">{pacienteRegistrado.nombre}</p>
            <div className="patient-code"><small>CÓDIGO DE SEGUIMIENTO</small><strong>{pacienteRegistrado.codigo}</strong></div>
            <div className="qr-panel">
              <p>Escanea este código para consultar el itinerario de la visita.</p>
              <div className="qr-frame"><QRCodeSVG value={urlPaciente} size={176} /></div>
              <small className="qr-url">{urlPaciente}</small>
            </div>
            <div className="registered-studies">
              <h3>Estudios programados</h3>
              {pacienteRegistrado.estudios.map((e, i) => <div className="registered-study" key={e.id || i}><span>{i + 1}</span><div><strong>{e.nombre}</strong><small>{e.area} · aprox. {e.duracion} min</small></div></div>)}
            </div>
            <button className="action-primary new-patient" onClick={handleNuevo}>Registrar otro paciente <span>→</span></button>
          </div>
        )}
      </section>

      <style>{`
        .kiosk-page { width: min(820px, calc(100% - 48px)); margin: 0 auto; padding: 38px 0 64px; }
        .kiosk-page .page-heading { margin-bottom: 25px; }
        .stepper { display: flex; gap: 14px; margin-bottom: 22px; }
        .step-item { flex: 1; min-width: 0; }.step-line { height: 4px; border-radius: 8px; background: #dce8e8; margin-bottom: 9px; }.step-line.reached { background: #087f8c; }
        .step-label { color: #8a9b9e; font-size: 11px; font-weight: 600; }.step-label.current, .step-label.done { color: #075b66; }
        .kiosk-card { padding: 30px; border: 1px solid #dce8e8; border-radius: 20px; background: white; box-shadow: 0 12px 32px rgba(17,63,69,.06); }
        .form-section-title { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 25px; }.form-section-title > span { width: 35px; height: 35px; display: grid; place-items: center; flex: 0 0 35px; border-radius: 11px; background: #e5f4f3; color: #087f8c; font: 800 12px 'Manrope', sans-serif; }
        .form-section-title h2 { margin: 0 0 4px; font: 800 17px 'Manrope', sans-serif; }.form-section-title p { color: #829397; font-size: 12px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }.field { min-width: 0; }.field.full { grid-column: 1 / -1; }.field label { display: block; margin-bottom: 7px; color: #476166; font-size: 11px; font-weight: 700; }.field label b { color: #c46a50; }.field label span { color: #91a0a3; font-weight: 400; }
        .field input, .field select { width: 100%; min-height: 45px; padding: 11px 13px; border: 1px solid #dce8e8; border-radius: 10px; background: #fbfdfd; color: #18333a; font-size: 13px; }.field input:focus, .field select:focus { outline: 3px solid rgba(8,127,140,.12); border-color: #65afb0; }
        .form-actions { display: flex; justify-content: flex-end; margin-top: 27px; }.form-actions.split { justify-content: space-between; gap: 12px; }
        .action-primary, .action-secondary { min-height: 44px; padding: 0 19px; display: inline-flex; align-items: center; justify-content: center; gap: 14px; border: 0; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; }.action-primary { background: #087f8c; color: white; }.action-primary:hover { background: #075b66; }.action-primary:disabled { opacity: .45; cursor: not-allowed; }.action-secondary { background: #edf4f4; color: #476166; }
        .study-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }.study-option { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 17px; border: 1px solid #dce8e8; border-radius: 13px; background: #fff; text-align: left; cursor: pointer; transition: .18s; }.study-option:hover { border-color: #83bdbb; background: #f8fcfc; }.study-option.selected { border: 1.5px solid #087f8c; background: #f0f9f8; }.study-check { position: absolute; top: 13px; right: 13px; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 7px; background: #edf4f4; color: #71868a; font-size: 15px; }.selected .study-check { background: #087f8c; color: white; }.study-option strong { padding-right: 25px; color: #25464c; font-size: 12px; }.study-option small { color: #829397; font-size: 10px; }.study-instruction { margin-top: 4px; color: #9a7552; font-size: 10px; line-height: 1.5; }.selection-count { margin-top: 14px; color: #71868a; font-size: 11px; }
        .success-view { max-width: 520px; margin: 0 auto; text-align: center; }.success-mark { width: 52px; height: 52px; display: grid; place-items: center; margin: 0 auto 15px; border-radius: 50%; background: #e8f5ee; color: #39856b; font-size: 26px; font-weight: 700; }.success-view h2 { margin: 7px 0 4px; font: 800 23px 'Manrope', sans-serif; }.success-name { color: #71868a; font-size: 13px; }.patient-code { display: inline-flex; flex-direction: column; gap: 4px; margin: 19px 0; padding: 10px 24px; border: 1px dashed #83bdbb; border-radius: 12px; background: #f4faf9; }.patient-code small { color: #71868a; font-size: 9px; font-weight: 700; letter-spacing: 1px; }.patient-code strong { color: #075b66; font: 800 25px 'Manrope', sans-serif; letter-spacing: 2px; }
        .qr-panel { padding: 19px; border: 1px solid #e4eeee; border-radius: 15px; background: #f8fbfb; }.qr-panel > p { margin-bottom: 15px; color: #71868a; font-size: 12px; }.qr-frame { display: inline-flex; padding: 12px; border-radius: 12px; background: white; border: 1px solid #e5eeee; }.qr-url { display: block; margin-top: 12px; color: #8b9b9e; font-size: 10px; overflow-wrap: anywhere; }.registered-studies { margin: 23px 0; text-align: left; }.registered-studies h3 { margin-bottom: 11px; font: 800 13px 'Manrope', sans-serif; }.registered-study { display: flex; align-items: center; gap: 11px; padding: 11px 12px; border-bottom: 1px solid #edf2f2; }.registered-study > span { width: 25px; height: 25px; display: grid; place-items: center; border-radius: 8px; background: #e5f4f3; color: #087f8c; font-size: 11px; font-weight: 700; }.registered-study div { display: flex; flex-direction: column; gap: 3px; }.registered-study strong { color: #36545a; font-size: 11px; }.registered-study small { color: #829397; font-size: 10px; }.new-patient { width: 100%; }
        @media(max-width:600px) { .kiosk-page { width: calc(100% - 32px); padding-top: 27px; }.kiosk-card { padding: 21px 17px; }.stepper { gap: 7px; }.step-label { font-size: 9px; }.form-grid, .study-grid { grid-template-columns: 1fr; }.field.full { grid-column: auto; }.form-actions.split { flex-direction: column-reverse; }.form-actions.split button { width: 100%; } }
      `}</style>
    </main>
  );
}
