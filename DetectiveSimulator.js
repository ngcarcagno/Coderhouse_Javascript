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

let erroresJugador = [];

let perfilDetective = {
  nombre: "",
  casosResueltos: 0,
  intentosTotales: 0,
};

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
      "cabina del conductor",
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

const misterios = [
  misterioMuseoSilencioso,
  misterioMansionEmbrujada,
  misterioLaboratorioProhibido,
  misterioTraicionCorona,
  misterioTrenNocturno,
];

function mostrarOpciones(array) {
  // Ordenar alfabéticamente para añadir randomizacion
  array.sort();
  let mensaje = "";
  array.forEach((item, index) => {
    mensaje += `${index + 1}. ${item}\n`;
  });
  return mensaje;
}

function obtenerEleccion(array, tipo, pista) {
  let eleccion = 0;
  let entrada = prompt(
    `Pista: ${pista}\n \n Elige un ${tipo}:\n${mostrarOpciones(array)}`
  );

  while (entrada === null || eleccion < 1 || eleccion > array.length) {
    if (entrada !== null) {
      eleccion = parseInt(entrada);
    }

    if (entrada === null || eleccion < 1 || eleccion > array.length) {
      entrada = prompt(
        `Entrada inválida. Por favor, elige un número entre 1 y ${
          array.length
        }:\nPista: ${pista}\n \n Elige un ${tipo}:\n${mostrarOpciones(array)}`
      );
    }
  }

  return array[eleccion - 1];
}

function resolverMisterio(misterio, indice) {
  alert(`Elegiste resolver: "${misterio.nombre}"\n\n${misterio.narrativa}`);

  let intentos = 3;
  let exito = false;

  alert(
    `Dispones de ${intentos} intentos para resolver el misterio ${perfilDetective.nombre}.`
  );

  while (intentos > 0 && !exito) {
    let lugarElegido = obtenerEleccion(
      misterio.opciones.lugares,
      "lugar",
      misterio.pistas.lugar
    );
    if (lugarElegido !== misterio.lugarCorrecto) {
      intentos--;
      erroresJugador.push(`Lugar incorrecto: ${lugarElegido}`);
      alert(
        `El lugar es incorrecto. Te quedan ${intentos} intentos ${perfilDetective.nombre}.`
      );
      continue;
    }

    let objetoElegido = obtenerEleccion(
      misterio.opciones.objetos,
      "objeto",
      misterio.pistas.objeto
    );
    if (objetoElegido !== misterio.objetoCorrecto) {
      intentos--;
      erroresJugador.push(`Objeto incorrecto: ${objetoElegido}`);
      alert(
        `El objeto es incorrecto. Te quedan ${intentos} intentos ${perfilDetective.nombre}.`
      );
      continue;
    }

    let sospechosoElegido = obtenerEleccion(
      misterio.opciones.sospechosos,
      "sospechoso",
      misterio.pistas.sospechoso
    );
    if (sospechosoElegido !== misterio.sospechosoCorrecto) {
      intentos--;
      erroresJugador.push(`Sospechoso incorrecto: ${sospechosoElegido}`);
      alert(
        `El sospechoso es incorrecto. Te quedan ${intentos} intentos ${perfilDetective.nombre}.`
      );
      continue;
    }

    exito = true;
    perfilDetective.casosResueltos++;
    alert("¡Felicidades! Has resuelto el misterio correctamente.");
    // Eliminar el misterio resuelto del array
    misterios.splice(indice, 1);
  }

  perfilDetective.intentosTotales += 3 - intentos;

  if (!exito) {
    alert(
      `No has resuelto el misterio ${perfilDetective.nombre}. La solución era:\n` +
        `Lugar: ${misterio.lugarCorrecto}\n` +
        `Objeto: ${misterio.objetoCorrecto}\n` +
        `Sospechoso: ${misterio.sospechosoCorrecto}\n\n` +
        `Errores cometidos: ${erroresJugador.join(", ")}`
    );
  }

  while (erroresJugador.length > 0) {
    erroresJugador.pop();
  }
}

function mostrarMisterios() {
  let mensaje = "";
  misterios.forEach((misterio, index) => {
    mensaje += `${index + 1}. ${misterio.nombre}\n`;
  });
  return mensaje;
}

function elegirMisterio() {
  if (misterios.length === 0) {
    alert(
      `¡Felicidades ${perfilDetective.nombre}! Has resuelto todos los misterios.`
    );
    return null;
  }

  let eleccion = 0;
  let entrada = prompt(
    `Hola ${
      perfilDetective.nombre
    }, estás a punto de resolver un misterio. Escoge sabiamente tus opciones para resolver el caso. Elige uno de los misterios pendientes de resolución\n${mostrarMisterios()}`
  );

  while (
    entrada === null ||
    entrada === "" ||
    eleccion < 1 ||
    eleccion > misterios.length
  ) {
    if (entrada !== null && entrada !== "") {
      eleccion = parseInt(entrada);
    }

    if (
      entrada === null ||
      entrada === "" ||
      eleccion < 1 ||
      eleccion > misterios.length
    ) {
      entrada = prompt(
        `Entrada inválida. Por favor, elige un número entre 1 y ${
          misterios.length
        }:\nHola ${
          perfilDetective.nombre
        }, estás a punto de resolver un misterio. Escoge sabiamente tus opciones para resolver el caso. Elige uno de los misterios pendientes de resolución\n${mostrarMisterios()}`
      );
    }
  }

  return { misterio: misterios[eleccion - 1], indice: eleccion - 1 };
}

function CorrerSimulacion() {
  while (true) {
    const seleccion = elegirMisterio();
    if (seleccion === null) break; // Salir si no quedan misterios
    resolverMisterio(seleccion.misterio, seleccion.indice);
    alert(
      `Estadísticas de ${perfilDetective.nombre}:\n` +
        `Casos resueltos: ${perfilDetective.casosResueltos}\n` +
        `Errores: ${perfilDetective.intentosTotales}`
    );
    if (misterios.length > 0) {
      const continuar = confirm("¿Deseas resolver otro misterio?");
      if (!continuar) {
        break;
      }
    } else {
      break;
    }
  }
  alert("¡Hasta la próxima!");
}

// Inicializar el perfil del detective
perfilDetective.nombre = prompt(
  `Bienvenido al simulador de misterios, dime tu nombre de Detective para comenzar:`
);
CorrerSimulacion();
