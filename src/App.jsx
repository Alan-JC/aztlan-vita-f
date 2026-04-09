import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Kiosco from "./pages/Kiosco";
import Staff from "./pages/Staff";
import Paciente from "./pages/Paciente";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/paciente/:codigo" element={<Paciente />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={
            <div style={{ minHeight: "100vh", background: "#f0f9ff" }}>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/kiosco" element={<Kiosco />} />
                <Route path="/staff" element={<Staff />} />
              </Routes>
            </div>
          } />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
