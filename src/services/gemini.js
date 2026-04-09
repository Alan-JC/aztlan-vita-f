const API_KEY = "AIzaSyBWa5rLRaTodYzW4RtJkPcZ2Me6oCc_cvw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function llamarGemini(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      }
    })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  const texto = data.candidates[0].content.parts[0].text;
  return texto;
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
  const prompt = `Eres un asistente médico de triaje para México.
Analiza estos síntomas: "${sintomas}"

Responde SOLO con este JSON exacto:
{"nivel":"LEVE","recomendacion":"texto","motivo":"texto","siguientePaso":"texto"}

nivel solo puede ser: URGENTE, MODERADO o LEVE
Todo en español de México.`;
  return await llamarGemini(prompt);
}

export async function consultarKiosco(categoria, detalle) {
  const prompt = `Eres un kiosco de salud en México.
Categoría: "${categoria}", Síntomas: "${detalle}"

Responde SOLO con este JSON exacto:
{"orientacion":"texto","medicamento":"texto o No aplica","advertencia":"texto"}

Todo en español de México, lenguaje simple.`;
  return await llamarGemini(prompt);
}