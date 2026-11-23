import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Home() {
  const { pacientes } = useApp();
  const activos = pacientes.filter((p) => p.estado !== "completado").length;
  const completados = pacientes.filter((p) => p.estado === "completado").length;
  const enProceso = pacientes.filter((p) => p.estado === "en_proceso").length;

  const metricas = [
    { label: "Pacientes activos", valor: activos, detalle: "Pendientes de atención", icono: "◎", tono: "teal" },
    { label: "En proceso", valor: enProceso, detalle: "Atención en curso", icono: "↗", tono: "blue" },
    { label: "Completados", valor: completados, detalle: "Visitas finalizadas", icono: "✓", tono: "green" },
  ];

  return (
    <main className="home-page">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <span className="eyebrow"><span className="status-dot" /> PLATAFORMA DE GESTIÓN DE ATENCIÓN</span>
          <h1>Una visita más clara,<br /><em>de principio a fin.</em></h1>
          <p>Organiza el recorrido del paciente y facilita el seguimiento de cada etapa desde un solo lugar.</p>
          <div className="welcome-actions">
            <Link to="/kiosco" className="primary-action">Registrar paciente <span>↗</span></Link>
            <Link to="/staff" className="secondary-action">Abrir panel de staff</Link>
          </div>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-core"><span>AV</span><small>VITA F</small></div>
          <span className="art-caption caption-top">ATENCIÓN</span>
          <span className="art-caption caption-bottom">CONECTADA · 360°</span>
        </div>
      </section>

      <section className="overview-section">
        <div className="section-heading">
          <div><span className="section-kicker">VISTA GENERAL</span><h2>Resumen de atención</h2></div>
          <span className="demo-note">Datos de esta sesión</span>
        </div>
        <div className="metrics-grid">
          {metricas.map((m) => (
            <article className="metric-card" key={m.label}>
              <div className={`metric-icon ${m.tono}`}>{m.icono}</div>
              <div className="metric-value">{m.valor}</div>
              <div className="metric-label">{m.label}</div>
              <div className="metric-detail">{m.detalle}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="modules-section">
        <div className="section-heading">
          <div><span className="section-kicker">MÓDULOS</span><h2>Accesos principales</h2></div>
        </div>
        <div className="module-grid">
          <Link to="/kiosco" className="module-card">
            <span className="module-icon">＋</span>
            <span className="module-content"><strong>Kiosco de registro</strong><small>Captura datos, selecciona estudios y genera un código de seguimiento.</small><b>Ir al módulo <span>→</span></b></span>
          </Link>
          <Link to="/staff" className="module-card">
            <span className="module-icon staff-icon">▤</span>
            <span className="module-content"><strong>Panel del staff</strong><small>Consulta el flujo de pacientes y actualiza el estado de cada estudio.</small><b>Ir al módulo <span>→</span></b></span>
          </Link>
        </div>
      </section>

      <style>{`
        .home-page { width: min(1180px, calc(100% - 48px)); margin: 0 auto; padding: 38px 0 68px; }
        .welcome-panel { min-height: 340px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; padding: 48px 54px; border-radius: 24px; background: #075b66; color: white; }
        .welcome-copy { position: relative; z-index: 2; max-width: 610px; }
        .eyebrow { display: inline-flex; align-items: center; gap: 9px; color: #b7e3df; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #8ed5b2; box-shadow: 0 0 0 4px rgba(142,213,178,.13); }
        .welcome-copy h1 { margin: 22px 0 14px; color: white; font: 800 clamp(32px, 4.2vw, 48px)/1.12 'Manrope', sans-serif; letter-spacing: -1.8px; }
        .welcome-copy h1 em { color: #9bd8d2; font-style: normal; }
        .welcome-copy > p { max-width: 490px; color: #c5e1df; font-size: 14px; line-height: 1.75; }
        .welcome-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 27px; }
        .primary-action, .secondary-action { display: inline-flex; align-items: center; gap: 16px; padding: 12px 17px; border-radius: 10px; font-size: 12px; font-weight: 700; transition: transform .2s, background .2s; }
        .primary-action { background: white; color: #075b66; }
        .primary-action:hover, .secondary-action:hover { transform: translateY(-2px); }
        .primary-action span { font-size: 16px; }
        .secondary-action { color: white; border: 1px solid rgba(255,255,255,.3); }
        .welcome-art { position: absolute; right: 35px; top: 50%; width: 340px; height: 300px; transform: translateY(-50%); opacity: .9; }
        .art-orbit { position: absolute; border: 1px solid rgba(155,216,210,.28); border-radius: 50%; transform: rotate(-28deg); }
        .orbit-one { width: 300px; height: 150px; top: 70px; left: 20px; }
        .orbit-two { width: 240px; height: 240px; top: 25px; left: 50px; border-color: rgba(155,216,210,.16); }
        .art-core { position: absolute; top: 88px; left: 130px; width: 86px; height: 86px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,.42); border-radius: 25px; background: rgba(255,255,255,.1); box-shadow: 0 15px 45px rgba(0,0,0,.14); transform: rotate(-8deg); }
        .art-core span { color: white; font: 800 25px 'Manrope', sans-serif; }
        .art-core small { color: #a8d9d4; font-size: 8px; letter-spacing: 2px; }
        .art-caption { position: absolute; color: rgba(197,225,223,.7); font-size: 8px; letter-spacing: 2px; }
        .caption-top { top: 42px; right: 25px; }.caption-bottom { bottom: 42px; left: 16px; }
        .overview-section, .modules-section { margin-top: 38px; }
        .section-heading { display: flex; justify-content: space-between; align-items: end; gap: 16px; margin-bottom: 17px; }
        .section-kicker { display: block; margin-bottom: 5px; color: #087f8c; font-size: 9px; font-weight: 800; letter-spacing: 1.5px; }
        .section-heading h2 { margin: 0; font: 800 20px 'Manrope', sans-serif; letter-spacing: -.5px; }
        .demo-note { color: #819397; font-size: 11px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .metric-card { position: relative; padding: 21px 22px; border: 1px solid #dce8e8; border-radius: 16px; background: white; box-shadow: 0 8px 24px rgba(17,63,69,.035); }
        .metric-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 10px; font-size: 19px; font-weight: 700; }
        .metric-icon.teal { color: #087f8c; background: #e5f4f3; }.metric-icon.blue { color: #4274a7; background: #edf3fa; }.metric-icon.green { color: #39856b; background: #eaf5ef; }
        .metric-value { margin-top: 16px; color: #18333a; font: 800 30px 'Manrope', sans-serif; letter-spacing: -1px; }
        .metric-label { margin-top: 2px; color: #304e53; font-size: 13px; font-weight: 700; }
        .metric-detail { margin-top: 5px; color: #84979a; font-size: 11px; }
        .module-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .module-card { display: flex; align-items: flex-start; gap: 17px; padding: 23px; border: 1px solid #dce8e8; border-radius: 16px; background: white; transition: transform .2s, box-shadow .2s, border-color .2s; }
        .module-card:hover { transform: translateY(-3px); border-color: #a8d5d2; box-shadow: 0 14px 30px rgba(17,63,69,.08); }
        .module-icon { width: 42px; height: 42px; flex: 0 0 42px; display: grid; place-items: center; border-radius: 13px; background: #e5f4f3; color: #087f8c; font-size: 25px; }
        .staff-icon { background: #edf3fa; color: #4274a7; font-size: 20px; }
        .module-content { display: flex; flex-direction: column; align-items: flex-start; }
        .module-content strong { color: #18333a; font: 800 14px 'Manrope', sans-serif; }
        .module-content small { margin-top: 7px; color: #71868a; font-size: 12px; line-height: 1.6; }
        .module-content b { margin-top: 17px; color: #087f8c; font-size: 11px; }.module-content b span { margin-left: 5px; font-size: 15px; }
        @media (max-width: 760px) { .welcome-panel { padding: 36px 30px; }.welcome-art { right: -130px; opacity: .28; }.welcome-copy { max-width: 100%; }.metrics-grid { gap: 10px; }.metric-card { padding: 16px; } }
        @media (max-width: 560px) { .home-page { width: calc(100% - 32px); padding-top: 24px; }.welcome-panel { min-height: 0; padding: 30px 23px; border-radius: 19px; }.welcome-copy h1 { font-size: 32px; }.welcome-copy > p { font-size: 13px; }.welcome-art { display: none; }.metrics-grid { grid-template-columns: 1fr; }.metric-card { display: grid; grid-template-columns: 38px 1fr; column-gap: 12px; align-items: center; }.metric-icon { grid-row: span 2; }.metric-value { margin-top: 0; font-size: 24px; }.metric-label { grid-column: 2; }.metric-detail { grid-column: 2; }.module-grid { grid-template-columns: 1fr; }.section-heading h2 { font-size: 18px; } }
      `}</style>
    </main>
  );
}
