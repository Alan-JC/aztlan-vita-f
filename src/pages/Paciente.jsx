import { useApp } from "../context/AppContext";
import { useParams } from "react-router-dom";


const ESTADO_CONFIG = {
  pendiente: { color: "#edf2f2", texto: "#829397", label: "Pendiente" },
  en_espera: { color: "#fff4df", texto: "#986b27", label: "En espera" },
  en_proceso: { color: "#eaf2fa", texto: "#426d9b", label: "En proceso" },
  completado: { color: "#eaf5ef", texto: "#39856b", label: "Completado" },
};

export default function Paciente() {
  const { codigo } = useParams();
  const { pacientes } = useApp();
  const paciente = pacientes.find((p) => p.codigo === codigo);

  if (!paciente) {
    return <div className="patient-state"><div className="state-symbol">?</div><h2>No encontramos este código</h2><p>Verifica el código de seguimiento con el personal de recepción.</p><style>{patientStyles}</style></div>;
  }

  const estudioActual = paciente.estudios.find((e) => e.estado === "en_espera" || e.estado === "en_proceso");
  const completados = paciente.estudios.filter((e) => e.estado === "completado").length;
  const total = paciente.estudios.length;
  const progreso = total ? Math.round((completados / total) * 100) : 0;
  const tiempoTotal = paciente.estudios.filter((e) => e.estado !== "completado").reduce((a, b) => a + b.duracion, 0);
  const todosCompletos = paciente.estado === "completado";

  return (
    <main className="tracking-page">
      <header className="tracking-header">
        <div className="tracking-brand"><span className="tracking-mark">AV</span><div><strong>Aztlán Vita F</strong><small>Seguimiento de tu visita</small></div></div>
        <span className="live-indicator"><i /> Actualización en vivo</span>
        <div className="tracking-intro"><span className="section-kicker">TU EXPERIENCIA DE ATENCIÓN</span><h1>Hola, {paciente.nombre}</h1><p>Consulta el avance de tus estudios y conoce cuál es el siguiente paso.</p><span className="tracking-code">{paciente.codigo}</span></div>
      </header>

      <div className="tracking-content">
        <section className="progress-card">
          {todosCompletos ? <div className="visit-complete"><span>✓</span><div><h2>Tu visita ha finalizado</h2><p>Todos los estudios programados aparecen como completados. Acércate a recepción para conocer los siguientes pasos.</p></div></div> : <>
            <div className="progress-heading"><div><span className="section-kicker">RESUMEN</span><h2>Progreso de tu visita</h2></div><strong>{progreso}%</strong></div>
            <div className="tracking-progress"><span style={{ width: `${progreso}%` }} /></div>
            <div className="progress-foot"><span>{completados} de {total} estudios completados</span><span>Tiempo estimado restante: ~{tiempoTotal} min</span></div>
          </>}
        </section>

        {!todosCompletos && estudioActual && <section className="next-step-card"><span className="section-kicker">{estudioActual.estado === "en_proceso" ? "ATENCIÓN EN CURSO" : "TU SIGUIENTE PASO"}</span><h2>{estudioActual.nombre}</h2><div className="destination-row"><span className="destination-icon">⌖</span><div><small>Área indicada</small><strong>{estudioActual.area}</strong></div></div><div className="instruction-row"><strong>Antes de continuar</strong><p>{estudioActual.instruccion}</p></div></section>}

        <section className="itinerary-card"><div className="itinerary-heading"><div><span className="section-kicker">RECORRIDO</span><h2>Itinerario de estudios</h2></div><span>{total} en total</span></div>
          <div className="itinerary-list">{paciente.estudios.map((e, i) => { const config = ESTADO_CONFIG[e.estado] || ESTADO_CONFIG.pendiente; return <div className="itinerary-item" key={e.id || i}><div className="timeline"><span className={e.estado === "completado" ? "timeline-dot done" : e.estado === "en_proceso" ? "timeline-dot active" : "timeline-dot"}>{e.estado === "completado" ? "✓" : i + 1}</span>{i < total - 1 && <i />}</div><div className="itinerary-detail"><div className="itinerary-title"><strong>{e.nombre}</strong><span style={{ background: config.color, color: config.texto }}>{config.label}</span></div><p>{e.area} · aprox. {e.duracion} min</p></div></div>; })}</div>
        </section>

        {!todosCompletos && <aside className="help-note"><span>i</span><div><strong>¿Tienes alguna duda?</strong><p>El personal de la clínica puede orientarte sobre la preparación y el recorrido de tus estudios.</p></div></aside>}
        <footer className="tracking-footer">Aztlán Vita F <span>·</span> Información de seguimiento de tu visita</footer>
      </div>

      <style>{patientStyles}</style>
    </main>
  );
}

const patientStyles = `
  .tracking-page { min-height: 100vh; background: #f4f8f8; color: #18333a; }.tracking-header { position: relative; padding: 25px max(24px, calc((100% - 760px)/2)) 65px; background: #075b66; color: white; }.tracking-brand { display: flex; align-items: center; gap: 11px; }.tracking-mark { width: 39px; height: 39px; display: grid; place-items: center; border-radius: 12px; background: rgba(255,255,255,.13); color: white; font: 800 13px 'Manrope', sans-serif; }.tracking-brand div { display: flex; flex-direction: column; gap: 2px; }.tracking-brand strong { font: 800 14px 'Manrope', sans-serif; }.tracking-brand small { color: #b7d8d5; font-size: 10px; }.live-indicator { position: absolute; top: 34px; right: max(24px, calc((100% - 760px)/2)); display: inline-flex; align-items: center; gap: 7px; color: #c6e5e1; font-size: 10px; }.live-indicator i { width: 7px; height: 7px; border-radius: 50%; background: #8ed5b2; }.tracking-intro { max-width: 760px; margin: 43px auto 0; }.tracking-intro .section-kicker { color: #9bd8d2; }.tracking-intro h1 { margin: 9px 0 7px; color: white; font: 800 clamp(26px, 5vw, 34px) 'Manrope', sans-serif; letter-spacing: -.8px; }.tracking-intro > p { max-width: 490px; color: #c5e1df; font-size: 12px; line-height: 1.7; }.tracking-code { display: inline-block; margin-top: 17px; padding: 7px 12px; border: 1px solid rgba(255,255,255,.23); border-radius: 8px; color: white; font: 700 12px 'Manrope', sans-serif; letter-spacing: 1.5px; }
  .tracking-content { position: relative; width: min(760px, calc(100% - 32px)); margin: -35px auto 0; }.progress-card, .itinerary-card { padding: 22px; border: 1px solid #dce8e8; border-radius: 17px; background: white; box-shadow: 0 10px 28px rgba(17,63,69,.06); }.progress-heading, .itinerary-heading { display: flex; align-items: center; justify-content: space-between; gap: 15px; }.progress-heading h2, .itinerary-heading h2 { margin: 3px 0 0; font: 800 17px 'Manrope', sans-serif; }.progress-heading > strong { color: #087f8c; font: 800 27px 'Manrope', sans-serif; }.tracking-progress { height: 8px; margin: 19px 0 10px; overflow: hidden; border-radius: 9px; background: #edf3f3; }.tracking-progress span { display: block; height: 100%; border-radius: inherit; background: #087f8c; transition: width .3s; }.progress-foot { display: flex; justify-content: space-between; gap: 10px; color: #829397; font-size: 10px; }.visit-complete { display: flex; align-items: center; gap: 14px; }.visit-complete > span { width: 43px; height: 43px; flex: 0 0 43px; display: grid; place-items: center; border-radius: 13px; background: #eaf5ef; color: #39856b; font-size: 22px; }.visit-complete h2 { margin: 0 0 5px; font: 800 16px 'Manrope', sans-serif; }.visit-complete p { color: #71868a; font-size: 11px; line-height: 1.6; }
  .next-step-card { margin-top: 14px; padding: 22px; border-radius: 17px; background: #087f8c; color: white; box-shadow: 0 10px 25px rgba(8,127,140,.15); }.next-step-card .section-kicker { color: #b6e1dd; }.next-step-card h2 { margin: 7px 0 17px; color: white; font: 800 20px 'Manrope', sans-serif; }.destination-row { display: flex; align-items: center; gap: 11px; padding: 12px; border-radius: 11px; background: rgba(255,255,255,.12); }.destination-icon { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 9px; background: rgba(255,255,255,.14); font-size: 20px; }.destination-row div { display: flex; flex-direction: column; gap: 3px; }.destination-row small { color: #b6e1dd; font-size: 9px; }.destination-row strong { color: white; font-size: 12px; }.instruction-row { margin-top: 10px; padding: 12px; border: 1px solid rgba(255,255,255,.19); border-radius: 11px; }.instruction-row strong { color: #d9efec; font-size: 10px; }.instruction-row p { margin-top: 4px; color: white; font-size: 11px; line-height: 1.6; }
  .itinerary-card { margin-top: 14px; }.itinerary-heading { margin-bottom: 21px; }.itinerary-heading > span { color: #829397; font-size: 10px; }.itinerary-list { display: flex; flex-direction: column; }.itinerary-item { display: flex; gap: 13px; min-height: 61px; }.timeline { display: flex; flex-direction: column; align-items: center; width: 27px; flex: 0 0 27px; }.timeline-dot { z-index: 1; width: 27px; height: 27px; display: grid; place-items: center; border: 1px solid #dce8e8; border-radius: 50%; background: #f4f8f8; color: #829397; font-size: 10px; font-weight: 700; }.timeline-dot.done { border-color: #d7eade; background: #eaf5ef; color: #39856b; }.timeline-dot.active { border: 2px solid #087f8c; background: #e5f4f3; color: #075b66; }.timeline > i { width: 1px; flex: 1; min-height: 22px; background: #e1ebeb; }.itinerary-detail { flex: 1; padding: 3px 0 16px; }.itinerary-title { display: flex; align-items: center; justify-content: space-between; gap: 9px; }.itinerary-title strong { color: #36545a; font-size: 11px; }.itinerary-title span { padding: 4px 8px; border-radius: 7px; font-size: 9px; font-weight: 700; white-space: nowrap; }.itinerary-detail p { margin-top: 4px; color: #91a0a3; font-size: 10px; }
  .help-note { display: flex; gap: 11px; margin-top: 14px; padding: 15px; border: 1px solid #e5e9d8; border-radius: 13px; background: #fbfcf5; }.help-note > span { width: 23px; height: 23px; flex: 0 0 23px; display: grid; place-items: center; border-radius: 50%; background: #f0f1df; color: #8c8a54; font-weight: 700; font-size: 12px; }.help-note strong { color: #5e674b; font-size: 10px; }.help-note p { margin-top: 4px; color: #858a70; font-size: 10px; line-height: 1.6; }.tracking-footer { padding: 24px 0 30px; color: #9aa9ab; text-align: center; font-size: 9px; }.tracking-footer span { margin: 0 5px; }
  .patient-state { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 25px; background: #f4f8f8; text-align: center; }.state-symbol { width: 54px; height: 54px; display: grid; place-items: center; margin-bottom: 16px; border-radius: 17px; background: #e5f4f3; color: #087f8c; font: 800 24px 'Manrope', sans-serif; }.patient-state h2 { margin: 0 0 7px; font: 800 18px 'Manrope', sans-serif; }.patient-state p { color: #829397; font-size: 12px; }
  @media(max-width:560px) { .tracking-header { padding: 20px 20px 62px; }.live-indicator { top: 29px; right: 20px; font-size: 0; }.tracking-intro { margin-top: 35px; }.tracking-content { width: calc(100% - 28px); }.progress-card, .itinerary-card { padding: 17px; }.progress-foot { flex-direction: column; gap: 4px; }.itinerary-title { align-items: flex-start; }.itinerary-title strong { max-width: 60%; line-height: 1.5; } }
`;
