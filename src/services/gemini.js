const API_URL = import.meta.env.VITE_AI_API_URL;

async function llamarGemini(prompt) {
  if (!API_URL) {
    throw new Error("La integración de IA requiere configurar un backend propio en VITE_AI_API_URL. No coloques una clave privada de Gemini en el frontend.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error("No fue posible obtener una respuesta del servicio de IA.");
  }

  const data = await response.json();
  return data.text || data.respuesta || "";
}

export async function analizarFlujo(pacientes) {
  const prompt = `Eres un copiloto de operaciones para una clínica Salud Digna en México.
Analiza este flujo actual de pacientes y da recomendaciones operativas concretas:

${JSON.stringify(pacientes, null, 2)}

Responde en 3-4 oraciones cortas y directas en español. Incluye:
1. Estado general del flujo
2. Si hay saturación en algún área
3. Una acción concreta que el staff debe tomar ahora
4. Tiempo estimado para normalizar el flujo

Sé directo y útil, como un copiloto de operaciones real.`;
  return await llamarGemini(prompt);
}

export async function generarConsejo(estudio, paciente) {
  const prompt = `Eres un asistente de salud amable en una clínica Salud Digna México.
El paciente ${paciente.nombre}, de ${paciente.edad} años (${paciente.sexo}), está esperando para: ${estudio.nombre}.

Da un consejo corto, amable y útil de máximo 2 oraciones para mientras espera.
Incluye algo específico sobre la preparación o qué esperar del estudio.
Escribe en español mexicano, tono cálido y tranquilizador.`;
  return await llamarGemini(prompt);
}

export async function analizarSintomas(sintomas) {
  const prompt = `Eres un asistente informativo de salud para México.
No diagnostiques ni sustituyas a un profesional de salud. Si hay señales de emergencia, indica buscar atención de emergencia.
Analiza estos síntomas: "${sintomas}"

Responde SOLO con este JSON exacto:
{"nivel":"LEVE","recomendacion":"texto","motivo":"texto","siguientePaso":"texto"}

nivel solo puede ser: URGENTE, MODERADO o LEVE.
Todo en español de México.`;
  return await llamarGemini(prompt);
}

export async function consultarKiosco(categoria, detalle) {
  const prompt = `Eres un kiosco informativo de salud en México.
Categoría: "${categoria}", descripción: "${detalle}"

No recomiendes medicamentos ni dosis. No diagnostiques. Indica cuándo consultar a personal de salud.
Responde SOLO con este JSON exacto:
{"orientacion":"texto","medicamento":"Consulta con personal de salud","advertencia":"texto"}

Todo en español de México, lenguaje simple.`;
  return await llamarGemini(prompt);
}
