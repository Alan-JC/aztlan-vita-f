import { useState } from "react";
import { useApp } from "../context/AppContext";
import { analizarFlujo } from "../services/gemini";

const ESTADO_COLOR = {
  en_espera: { bg: "#fff4df", text: "#986b27", label: "En espera" },
  en_proceso: { bg: "#eaf2fa", text: "#426d9b", label: "En proceso" },
  completado: { bg: "#eaf5ef", text: "#39856b", label: "Completado" },
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
        estado: p.estado,
        cantidadEstudios: p.estudios.length,
        estudios: p.estudios.map((e) => `${e.nombre}(${e.estado})`).join(", "),
      }));
      const texto = await analizarFlujo(resumen);
      setSugerenciaIA(texto);
    } catch (e) {
      setSugerenciaIA("No fue posible realizar el análisis. Verifica la configuración del servicio e inténtalo de nuevo.");
    }
    setCargandoIA(false);
  }

  return (
    <main className="staff-page">
      <header className="staff-header">
        <div className="page-heading"><span className="section-kicker">OPERACIÓN CLÍNICA</span><h1>Panel del staff</h1><p>Supervisa el flujo de atención y actualiza el avance de los estudios.</p></div>
        <div className="staff-actions">
          <button className="ai-button" onClick={handleAnalizar} disabled={cargandoIA || pacientes.length === 0}>{cargandoIA ? "Analizando..." : "✧ Analizar flujo con IA"}</button>
          {completados.length > 0 && <button className="clear-button" onClick={limpiarCompletados}>Limpiar completados</button>}
        </div>
      </header>

      <section className="staff-metrics">
        {[
          { label: "Total de pacientes", value: pacientes.length, note: "Registros en el sistema", tone: "teal" },
          { label: "En espera", value: enEspera, note: "Pendientes de iniciar", tone: "amber" },
          { label: "En proceso", value: enProceso, note: "Atención en curso", tone: "blue" },
          { label: "Completados", value: completados.length, note: "Visitas finalizadas", tone: "green" },
        ].map((m) => <article className="staff-metric" key={m.label}><span className={`metric-indicator ${m.tone}`} /><small>{m.label}</small><strong>{m.value}</strong><span className="metric-note">{m.note}</span></article>)}
      </section>

      {sugerenciaIA && <section className="ai-insight"><div className="ai-insight-icon">✧</div><div><span className="section-kicker">ASISTENTE DE OPERACIONES</span><h2>Análisis del flujo</h2><p>{sugerenciaIA}</p><small>Orientación operativa; verifica las decisiones con el personal responsable.</small></div></section>}

      <section className="patients-section">
        <div className="list-heading"><div><span className="section-kicker">SEGUIMIENTO</span><h2>Pacientes activos</h2></div><span>{activos.length} registro(s)</span></div>
        {activos.length === 0 ? (
          <div className="empty-state"><div>＋</div><h3>No hay pacientes activos</h3><p>Los nuevos registros aparecerán aquí para dar seguimiento a su atención.</p></div>
        ) : (
          <div className="patient-list">
            {activos.map((p) => {
              const estudioActual = p.estudios.find((e) => e.estado === "en_espera" || e.estado === "en_proceso");
              const completadosP = p.estudios.filter((e) => e.estado === "completado").length;
              const progresoP = p.estudios.length ? Math.round((completadosP / p.estudios.length) * 100) : 0;
              return (
                <article className="patient-card" key={p.codigo}>
                  <div className="patient-top">
                    <div className="patient-identity"><div className="patient-avatar">{p.nombre.charAt(0).toUpperCase()}</div><div><h3>{p.nombre}</h3><p>{p.codigo} <span>·</span> {p.edad} años</p></div></div>
                    <div className="patient-progress"><strong>{progresoP}%</strong><small>Completado</small></div>
                  </div>
                  <div className="progress-track"><div style={{ width: `${progresoP}%` }} /></div>
                  <div className="study-tags">{p.estudios.map((e, i) => { const config = ESTADO_COLOR[e.estado] || ESTADO_COLOR.en_espera; return <span key={i} style={{ background: config.bg, color: config.text }}>{e.nombre} · {config.label}</span>; })}</div>
                  {estudioActual && <div className="current-study"><div><small>ESTUDIO ACTUAL</small><strong>{estudioActual.nombre}</strong><span>{estudioActual.area} · aprox. {estudioActual.duracion} min</span></div><div className="study-actions">{estudioActual.estado === "en_espera" && <button className="start-button" onClick={() => iniciarEstudio(p.codigo)}>Iniciar</button>}<button className="complete-button" onClick={() => avanzarEstudio(p.codigo)}>Completar</button></div></div>}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {completados.length > 0 && <section className="completed-section"><div className="list-heading"><div><span className="section-kicker">FINALIZADOS</span><h2>Visitas completadas</h2></div><span>{completados.length} registro(s)</span></div><div className="completed-list">{completados.map((p) => <div className="completed-row" key={p.codigo}><span className="completed-check">✓</span><div><strong>{p.nombre}</strong><small>{p.codigo} · {p.estudios.length} estudio(s)</small></div><span className="completed-label">Completado</span></div>)}</div></section>}

      <style>{`
        .staff-page { width: min(1180px, calc(100% - 48px)); margin: 0 auto; padding: 38px 0 65px; }.staff-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 25px; }.staff-header .page-heading { margin: 0; }.staff-actions { display: flex; gap: 9px; align-items: center; flex-wrap: wrap; }.ai-button, .clear-button { min-height: 40px; padding: 0 14px; border-radius: 9px; font-size: 11px; font-weight: 700; cursor: pointer; }.ai-button { border: 0; background: #075b66; color: white; }.ai-button:hover { background: #087f8c; }.ai-button:disabled { opacity: .5; cursor: not-allowed; }.clear-button { border: 1px solid #dce8e8; background: white; color: #71868a; }
        .staff-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 13px; }.staff-metric { position: relative; display: flex; flex-direction: column; align-items: flex-start; padding: 18px; border: 1px solid #dce8e8; border-radius: 15px; background: white; box-shadow: 0 8px 24px rgba(17,63,69,.035); }.metric-indicator { width: 8px; height: 8px; border-radius: 50%; margin-bottom: 12px; }.metric-indicator.teal { background: #087f8c; }.metric-indicator.amber { background: #d5a34e; }.metric-indicator.blue { background: #6d93bd; }.metric-indicator.green { background: #58a17d; }.staff-metric small { color: #71868a; font-size: 11px; font-weight: 600; }.staff-metric strong { margin-top: 5px; color: #18333a; font: 800 29px 'Manrope', sans-serif; }.metric-note { margin-top: 3px; color: #9aa9ab; font-size: 10px; }
        .ai-insight { display: flex; gap: 15px; margin-top: 22px; padding: 20px; border: 1px solid #c7dfdc; border-radius: 15px; background: #eff8f6; }.ai-insight-icon { width: 36px; height: 36px; flex: 0 0 36px; display: grid; place-items: center; border-radius: 11px; background: #d9eeea; color: #087f8c; font-size: 22px; }.ai-insight h2 { margin: 3px 0 7px; font: 800 16px 'Manrope', sans-serif; }.ai-insight p { color: #47666a; font-size: 12px; line-height: 1.7; white-space: pre-line; }.ai-insight small { display: block; margin-top: 8px; color: #81999a; font-size: 10px; }
        .patients-section, .completed-section { margin-top: 35px; }.list-heading { display: flex; align-items: end; justify-content: space-between; gap: 15px; margin-bottom: 15px; }.list-heading h2 { margin: 0; font: 800 19px 'Manrope', sans-serif; }.list-heading > span { color: #829397; font-size: 11px; }.patient-list { display: grid; gap: 13px; }.patient-card { padding: 20px; border: 1px solid #dce8e8; border-radius: 16px; background: white; box-shadow: 0 8px 24px rgba(17,63,69,.035); }.patient-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }.patient-identity { display: flex; align-items: center; gap: 12px; min-width: 0; }.patient-avatar { width: 42px; height: 42px; flex: 0 0 42px; display: grid; place-items: center; border-radius: 12px; background: #e5f4f3; color: #087f8c; font: 800 17px 'Manrope', sans-serif; }.patient-identity h3 { margin: 0 0 3px; font: 800 13px 'Manrope', sans-serif; }.patient-identity p { color: #829397; font-size: 10px; }.patient-identity p span { margin: 0 4px; }.patient-progress { display: flex; flex-direction: column; align-items: flex-end; }.patient-progress strong { color: #087f8c; font: 800 19px 'Manrope', sans-serif; }.patient-progress small { color: #91a0a3; font-size: 9px; }.progress-track { height: 5px; margin: 16px 0; overflow: hidden; border-radius: 8px; background: #edf3f3; }.progress-track div { height: 100%; border-radius: inherit; background: #087f8c; transition: width .25s; }.study-tags { display: flex; flex-wrap: wrap; gap: 6px; }.study-tags span { padding: 5px 9px; border-radius: 7px; font-size: 9px; font-weight: 600; }
        .current-study { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 17px; padding: 13px 15px; border: 1px solid #e5eeee; border-radius: 11px; background: #f8fbfb; }.current-study > div:first-child { display: flex; flex-direction: column; gap: 3px; }.current-study small { color: #8a9b9e; font-size: 9px; font-weight: 800; letter-spacing: .8px; }.current-study strong { color: #29494f; font-size: 12px; }.current-study span { color: #829397; font-size: 10px; }.study-actions { display: flex; gap: 7px; flex-shrink: 0; }.study-actions button { min-height: 34px; padding: 0 12px; border: 0; border-radius: 8px; font-size: 10px; font-weight: 700; cursor: pointer; }.start-button { background: #eaf2fa; color: #426d9b; }.complete-button { background: #087f8c; color: white; }
        .empty-state { padding: 45px 20px; border: 1px dashed #cbdcdd; border-radius: 16px; background: white; text-align: center; }.empty-state > div { width: 42px; height: 42px; display: grid; place-items: center; margin: 0 auto 12px; border-radius: 13px; background: #e5f4f3; color: #087f8c; font-size: 24px; }.empty-state h3 { margin: 0 0 5px; font: 800 14px 'Manrope', sans-serif; }.empty-state p { color: #829397; font-size: 11px; }.completed-list { overflow: hidden; border: 1px solid #dce8e8; border-radius: 14px; background: white; }.completed-row { display: flex; align-items: center; gap: 11px; padding: 13px 16px; border-bottom: 1px solid #edf2f2; }.completed-row:last-child { border-bottom: 0; }.completed-check { width: 25px; height: 25px; display: grid; place-items: center; border-radius: 8px; background: #eaf5ef; color: #39856b; font-size: 13px; }.completed-row div { display: flex; flex-direction: column; gap: 3px; }.completed-row strong { color: #36545a; font-size: 11px; }.completed-row small { color: #91a0a3; font-size: 9px; }.completed-label { margin-left: auto; color: #39856b; font-size: 10px; font-weight: 700; }
        @media(max-width:760px) { .staff-header { flex-direction: column; }.staff-metrics { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width:560px) { .staff-page { width: calc(100% - 32px); padding-top: 27px; }.staff-actions { width: 100%; }.ai-button, .clear-button { flex: 1; }.staff-metrics { gap: 9px; }.staff-metric { padding: 14px; }.current-study { align-items: flex-start; flex-direction: column; }.study-actions { width: 100%; }.study-actions button { flex: 1; }.patient-card { padding: 15px; } }
      `}</style>
    </main>
  );
}
