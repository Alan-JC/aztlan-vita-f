import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export const ESTUDIOS_DISPONIBLES = [
  { id: "sangre", nombre: "Análisis de Sangre", area: "Laboratorio A", duracion: 15, instruccion: "No comer 8 horas antes" },
  { id: "orina", nombre: "Examen General de Orina", area: "Laboratorio A", duracion: 10, instruccion: "Primera orina del día" },
  { id: "rayosx", nombre: "Rayos X", area: "Imagenología", duracion: 20, instruccion: "Retirar objetos metálicos" },
  { id: "ultrasonido", nombre: "Ultrasonido", area: "Imagenología", duracion: 30, instruccion: "Vejiga llena, tomar agua 1 hora antes" },
  { id: "glucosa", nombre: "Glucosa en Ayuno", area: "Laboratorio B", duracion: 12, instruccion: "Ayuno estricto de 12 horas" },
  { id: "ecg", nombre: "Electrocardiograma", area: "Cardiología", duracion: 25, instruccion: "Ropa cómoda, sin cremas en el torso" },
];

function leer() {
  try { return JSON.parse(localStorage.getItem("aztlan_pacientes") || "[]"); } catch { return []; }
}

function guardar(p) {
  localStorage.setItem("aztlan_pacientes", JSON.stringify(p));
}

export function AppProvider({ children }) {
  const [pacientes, setPacientes] = useState(leer);

  function registrarPaciente(datos) {
    const codigo = `SD-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const estudiosConEstado = datos.estudios.map((id, index) => {
      const estudio = ESTUDIOS_DISPONIBLES.find((e) => e.id === id);
      return { ...estudio, estado: index === 0 ? "en_espera" : "pendiente", iniciadoEn: null, completadoEn: null };
    });
    const nuevo = { ...datos, codigo, estudios: estudiosConEstado, estado: "en_espera", registradoEn: new Date().toISOString() };
    const actualizados = [...leer(), nuevo];
    guardar(actualizados);
    setPacientes(actualizados);
    return nuevo;
  }

  function avanzarEstudio(codigo) {
    const actualizados = leer().map((p) => {
      if (p.codigo !== codigo) return p;
      const estudios = [...p.estudios];
      const idx = estudios.findIndex((e) => e.estado === "en_espera" || e.estado === "en_proceso");
      if (idx === -1) return p;
      estudios[idx] = { ...estudios[idx], estado: "completado", completadoEn: new Date().toISOString() };
      if (idx + 1 < estudios.length) estudios[idx + 1] = { ...estudios[idx + 1], estado: "en_espera", iniciadoEn: new Date().toISOString() };
      const todos = estudios.every((e) => e.estado === "completado");
      return { ...p, estudios, estado: todos ? "completado" : "en_proceso" };
    });
    guardar(actualizados);
    setPacientes(actualizados);
  }

  function iniciarEstudio(codigo) {
    const actualizados = leer().map((p) => {
      if (p.codigo !== codigo) return p;
      const estudios = [...p.estudios];
      const idx = estudios.findIndex((e) => e.estado === "en_espera");
      if (idx === -1) return p;
      estudios[idx] = { ...estudios[idx], estado: "en_proceso", iniciadoEn: new Date().toISOString() };
      return { ...p, estudios, estado: "en_proceso" };
    });
    guardar(actualizados);
    setPacientes(actualizados);
  }

  function getPaciente(codigo) {
    return leer().find((p) => p.codigo === codigo);
  }

  function limpiarCompletados() {
    const actualizados = leer().filter((p) => p.estado !== "completado");
    guardar(actualizados);
    setPacientes(actualizados);
  }

  return (
    <AppContext.Provider value={{ pacientes, estudiosDisponibles: ESTUDIOS_DISPONIBLES, registrarPaciente, avanzarEstudio, iniciarEstudio, getPaciente, limpiarCompletados }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}