import { createContext, useContext, useEffect, useState } from "react";
import { escucharPacientes, guardarPaciente, actualizarPaciente } from "../services/firebase";

const AppContext = createContext(null);

export const ESTUDIOS_DISPONIBLES = [
  { id: "sangre", nombre: "Análisis de Sangre", area: "Laboratorio A", duracion: 15, instruccion: "No comer 8 horas antes" },
  { id: "orina", nombre: "Examen General de Orina", area: "Laboratorio A", duracion: 10, instruccion: "Primera orina del día" },
  { id: "rayosx", nombre: "Rayos X", area: "Imagenología", duracion: 20, instruccion: "Retirar objetos metálicos" },
  { id: "ultrasonido", nombre: "Ultrasonido", area: "Imagenología", duracion: 30, instruccion: "Vejiga llena, tomar agua 1 hora antes" },
  { id: "glucosa", nombre: "Glucosa en Ayuno", area: "Laboratorio B", duracion: 12, instruccion: "Ayuno estricto de 12 horas" },
  { id: "ecg", nombre: "Electrocardiograma", area: "Cardiología", duracion: 25, instruccion: "Ropa cómoda, sin cremas en el torso" },
];

export function AppProvider({ children }) {
  const [pacientes, setPacientes] = useState([]);
  const [errorDatos, setErrorDatos] = useState("");

  useEffect(() => {
    const unsub = escucharPacientes((datos) => {
      setPacientes(datos);
      setErrorDatos("");
    }, (error) => {
      console.error("Error al sincronizar pacientes:", error);
      setErrorDatos("No se pudo conectar con la base de datos.");
    });
    return () => unsub();
  }, []);

  async function registrarPaciente(datos) {
    const codigo = `SD-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const estudiosConEstado = datos.estudios.map((id, index) => {
      const estudio = ESTUDIOS_DISPONIBLES.find((e) => e.id === id);
      return { ...estudio, estado: index === 0 ? "en_espera" : "pendiente", iniciadoEn: null, completadoEn: null };
    });
    const nuevo = { ...datos, codigo, estudios: estudiosConEstado, estado: "en_espera", registradoEn: new Date().toISOString() };
    await guardarPaciente(nuevo);
    return nuevo;
  }

  async function avanzarEstudio(codigo) {
    const paciente = pacientes.find((p) => p.codigo === codigo);
    if (!paciente) return;
    const estudios = [...paciente.estudios];
    const idx = estudios.findIndex((e) => e.estado === "en_espera" || e.estado === "en_proceso");
    if (idx === -1) return;
    estudios[idx] = { ...estudios[idx], estado: "completado", completadoEn: new Date().toISOString() };
    if (idx + 1 < estudios.length) estudios[idx + 1] = { ...estudios[idx + 1], estado: "en_espera", iniciadoEn: new Date().toISOString() };
    const todos = estudios.every((e) => e.estado === "completado");
    await actualizarPaciente(codigo, { estudios, estado: todos ? "completado" : "en_proceso" });
  }

  async function iniciarEstudio(codigo) {
    const paciente = pacientes.find((p) => p.codigo === codigo);
    if (!paciente) return;
    const estudios = [...paciente.estudios];
    const idx = estudios.findIndex((e) => e.estado === "en_espera");
    if (idx === -1) return;
    estudios[idx] = { ...estudios[idx], estado: "en_proceso", iniciadoEn: new Date().toISOString() };
    await actualizarPaciente(codigo, { estudios, estado: "en_proceso" });
  }

  function getPaciente(codigo) {
    return pacientes.find((p) => p.codigo === codigo);
  }

  async function limpiarCompletados() {
    // Retención/destrucción de datos debe definirse con controles adecuados en una aplicación real.
    setErrorDatos("La eliminación masiva de pacientes completados está deshabilitada en esta versión.");
  }

  return (
    <AppContext.Provider value={{ pacientes, errorDatos, estudiosDisponibles: ESTUDIOS_DISPONIBLES, registrarPaciente, avanzarEstudio, iniciarEstudio, getPaciente, limpiarCompletados }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
