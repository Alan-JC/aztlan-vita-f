import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/kiosco", label: "Kiosco" },
  { to: "/staff", label: "Panel de staff" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <nav className="topbar-inner" aria-label="Navegación principal">
        <Link to="/" className="brand-lockup" aria-label="Aztlán Vita F, inicio">
          <span className="brand-mark">AV</span>
          <span className="brand-copy">
            <strong>Aztlán Vita F</strong>
            <small>Atención y seguimiento</small>
          </span>
        </Link>

        <div className="nav-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={pathname === link.to ? "nav-link active" : "nav-link"}
              aria-current={pathname === link.to ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <style>{`
        .topbar { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,.94); border-bottom: 1px solid #dce8e8; backdrop-filter: blur(14px); }
        .topbar-inner { width: min(1180px, calc(100% - 48px)); min-height: 76px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .brand-lockup { display: inline-flex; align-items: center; gap: 12px; min-width: 0; }
        .brand-mark { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 13px; background: #087f8c; color: white; font: 800 14px 'Manrope', sans-serif; letter-spacing: -.5px; }
        .brand-copy { display: flex; flex-direction: column; gap: 2px; }
        .brand-copy strong { color: #18333a; font: 800 15px 'Manrope', sans-serif; }
        .brand-copy small { color: #6b8185; font-size: 11px; }
        .nav-links { display: flex; align-items: center; gap: 6px; }
        .nav-link { padding: 10px 15px; border-radius: 10px; color: #60777b; font-size: 13px; font-weight: 600; transition: background .2s, color .2s; }
        .nav-link:hover { background: #edf6f5; color: #075b66; }
        .nav-link.active { background: #e5f4f3; color: #075b66; }
        @media (max-width: 640px) {
          .topbar-inner { width: calc(100% - 32px); min-height: 68px; align-items: flex-start; flex-direction: column; justify-content: center; gap: 12px; padding: 12px 0; }
          .brand-mark { width: 36px; height: 36px; border-radius: 11px; }
          .nav-links { width: 100%; gap: 4px; }
          .nav-link { flex: 1; padding: 9px 8px; text-align: center; font-size: 12px; }
        }
      `}</style>
    </header>
  );
}
