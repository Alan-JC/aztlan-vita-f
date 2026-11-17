<div align="center">

# Aztlán Vita
### Plataforma de acompañamiento y gestión de atención clínica

Prototipo web para organizar el recorrido del paciente y apoyar la coordinación entre pacientes y personal de una clínica.

**React · Vite · Firebase · Firestore · Gemini AI · Tailwind CSS**

</div>

---

## Visión general

Aztlán Vita explora cómo una experiencia digital puede facilitar la coordinación del proceso de atención.

- **Inicio:** resumen del flujo de pacientes.
- **Kiosco:** registro de pacientes y selección de estudios.
- **Panel de staff:** seguimiento operativo y actualización de estados.
- **Vista del paciente:** consulta del avance mediante un código.
- **Asistente con IA:** funciones experimentales de orientación informativa.

## Tecnologías

| Tecnología | Uso |
|---|---|
| React y React Router | Interfaz y navegación |
| Vite | Desarrollo y compilación |
| Firebase / Firestore | Persistencia y sincronización |
| Gemini API | Funciones experimentales de IA |
| Tailwind CSS | Estilos |
| lucide-react | Iconografía |
| qrcode.react | Códigos QR |
| Recharts | Gráficas |

## Estructura

```text
src/
├── components/
├── context/
├── pages/
│   ├── Home.jsx
│   ├── Kiosco.jsx
│   ├── Staff.jsx
│   ├── Paciente.jsx
│   └── Chatbot.jsx
├── services/
│   ├── firebase.js
│   └── gemini.js
├── App.jsx
└── main.jsx
```

## Instalación

```bash
git clone https://github.com/Alan-JC/aztlan-vita-f.git
cd aztlan-vita-f
npm install
npm run dev
```

Configura Firebase con variables públicas de configuración y reglas de Firestore restrictivas. La clave de Gemini debe permanecer exclusivamente en un backend; el frontend debe llamar a ese backend mediante `VITE_AI_API_URL`. No coloques secretos en variables `VITE_*`, porque se incorporan al código del navegador.

## Seguridad y privacidad

Este repositorio contiene integraciones externas. Una clave de Gemini que haya sido publicada debe considerarse comprometida: revócala y genera otra desde Google AI Studio. Configura restricciones de API y revisa el historial del repositorio.

No utilices datos reales de pacientes en este prototipo. Antes de cualquier uso real se requieren controles de acceso, protección de datos, revisión profesional y validación de seguridad. La IA no diagnostica ni sustituye atención médica.

## Estado

Prototipo de hackathon en desarrollo. La integración de IA requiere un backend seguro configurado por separado.

---

<div align="center"><sub>DESIGN · TECHNOLOGY · HUMAN-CENTERED CARE</sub></div>
