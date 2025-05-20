// Plantillas para las estructuras
const Opciones = {
  lugares: [],
  objetos: [],
  sospechosos: [],
};

const Pistas = {
  lugar: "",
  objeto: "",
  sospechoso: "",
};

const Misterio = {
  nombre: "",
  narrativa: "",
  lugarCorrecto: "",
  objetoCorrecto: "",
  sospechosoCorrecto: "",
  opciones: Opciones,
  pistas: Pistas,
};

// Definición de los misterios
const misterioMuseoSilencioso = {
  nombre: "El Enigma del Museo Silencioso",
  narrativa:
    "Una noche, un artefacto invaluable desapareció del museo sin dejar rastro. Las cámaras no captaron nada, pero el eco de un susurro aún resuena en algún lugar.",
  lugarCorrecto: "Sala de exposiciones",
  objetoCorrecto: "Estatua dorada",
  sospechosoCorrecto: "Guía turístico",
  opciones: {
    lugares: ["Sala de exposiciones", "Cafetería", "Tienda de regalos", "Baño"],
    objetos: [
      "Estatua dorada",
      "Cuadro famoso",
      "Joya antigua",
      "Documento histórico",
    ],
    sospechosos: [
      "Guía turístico",
      "Visitante",
      "Guardia de seguridad",
      "Director del museo",
    ],
  },
  pistas: {
    lugar:
      "El lugar del crimen es donde el silencio es más profundo, pero algo lo interrumpe.",
    objeto: "El objeto involucrado refleja algo que no debería estar allí.",
    sospechoso: "El culpable es alguien que conoce cada rincón del museo.",
  },
};

const misterioMansionEmbrujada = {
  nombre: "La Sombra en la Mansión Embrujada",
  narrativa:
    "Durante una fiesta, un grito resonó en la mansión y una joya invaluable desapareció. Las luces parpadearon y alguien se desvaneció en la penumbra.",
  lugarCorrecto: "Sala de baile",
  objetoCorrecto: "Collar de diamantes",
  sospechosoCorrecto: "Invitado misterioso",
  opciones: {
    lugares: ["Sala de baile", "Biblioteca", "Jardín", "Cocina"],
    objetos: [
      "Collar de diamantes",
      "Pistola antigua",
      "Libro raro",
      "Botella de vino",
    ],
    sospechosos: ["Invitado misterioso", "Anfitrión", "Sirviente", "Chef"],
  },
  pistas: {
    lugar: "El crimen ocurrió donde los pasos resuenan más allá de lo normal.",
    objeto: "Lo que se llevaron brilla con un fulgor que ciega.",
    sospechoso: "El culpable no pertenece del todo a este lugar.",
  },
};

const misterioLaboratorioProhibido = {
  nombre: "El Secreto del Laboratorio Prohibido",
  narrativa:
    "Un experimento fallido dejó un rastro de caos en el laboratorio. Algo peligroso fue robado bajo la luz de las alarmas.",
  lugarCorrecto: "Sala de experimentos",
  objetoCorrecto: "Frasco químico",
  sospechosoCorrecto: "Científico jefe",
  opciones: {
    lugares: ["Sala de experimentos", "Oficina", "Almacén", "Sala de control"],
    objetos: [
      "Frasco químico",
      "Computadora",
      "Herramienta quirúrgica",
      "Diagrama técnico",
    ],
    sospechosos: ["Científico jefe", "Asistente", "Técnico", "Guardia"],
  },
  pistas: {
    lugar: "El lugar vibra con energía contenida.",
    objeto: "Lo robado es pequeño pero letal.",
    sospechoso: "El culpable tiene las manos manchadas de conocimiento.",
  },
};

const misterioTraicionCorona = {
  nombre: "La Traición Bajo la Corona",
  narrativa:
    "El rey fue encontrado sin vida tras un banquete. Alguien cercano escondió la verdad entre las sombras del castillo.",
  lugarCorrecto: "Salón del trono",
  objetoCorrecto: "Daga envenenada",
  sospechosoCorrecto: "Consejero real",
  opciones: {
    lugares: [
      "Salón del trono",
      "Mazmorras",
      "Jardines reales",
      "Torre del reloj",
    ],
    objetos: [
      "Daga envenenada",
      "Cetro real",
      "Pergamino sellado",
      "Copa de oro",
    ],
    sospechosos: ["Consejero real", "Rey", "Guardia real", "Noble visitante"],
  },
  pistas: {
    lugar: "El crimen ocurrió donde el poder se siente más pesado.",
    objeto: "El arma susurra al pasar desapercibida.",
    sospechoso: "El culpable habla con autoridad disfrazada.",
  },
};

const misterioTrenNocturno = {
  nombre: "El Último Pasajero del Tren Nocturno",
  narrativa:
    "Un pasajero desapareció en el tren bajo la luna llena. Algo quedó atrás, oculto entre el traqueteo de los vagones.",
  lugarCorrecto: "Vagón de carga",
  objetoCorrecto: "Maleta cerrada",
  sospechosoCorrecto: "Revisor",
  opciones: {
    lugares: [
      "Vagón de carga",
      "Comedor",
      "Cabina del conductor",
      "Vagón de pasajeros",
    ],
    objetos: [
      "Maleta cerrada",
      "Boleto rasgado",
      "Reloj de bolsillo",
      "Linterna rota",
    ],
    sospechosos: ["Revisor", "Pasajero solitario", "Cocinero", "Mecánico"],
  },
  pistas: {
    lugar: "El lugar guarda más de lo que aparenta.",
    objeto: "Lo perdido contiene un secreto que no se ve.",
    sospechoso: "El culpable controla el ritmo del viaje.",
  },
};

// Array con todos los misterios
const misterios = [
  misterioMuseoSilencioso,
  misterioMansionEmbrujada,
  misterioLaboratorioProhibido,
  misterioTraicionCorona,
  misterioTrenNocturno,
];

// Exportar las constantes necesarias
export { misterios, Opciones, Pistas, Misterio };
