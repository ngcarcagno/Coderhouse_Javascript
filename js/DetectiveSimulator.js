import { misterios, Opciones, Pistas, Misterio } from "./misteriosData.js";

// Perfil del detective desde localStorage o inicial
let perfilDetective = {
  nombre: "",
  casosResueltos: 0,
  intentosTotales: 0,
};

let misterioActual = null;
let intentos = 3;

// Inicializar el juego
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector("#start-game");
  const nombreInput = document.querySelector("#detective-name-input");
  const errorMessage = document.querySelector("#error-message");

  // Ocultar el mensaje de error al escribir
  nombreInput.addEventListener("keydown", () => {
    errorMessage.style.display = "none";
  });

  startButton.addEventListener("click", iniciarJuego);
});

// Iniciar el juego con el nombre del detective
function iniciarJuego() {
  const nombreInput = document
    .querySelector("#detective-name-input")
    .value.trim();
  const errorMessage = document.querySelector("#error-message");
  const welcomeMessage = document.querySelector("#welcome-message");

  if (nombreInput) {
    const perfilKey = `perfilDetective_${nombreInput}`;
    const existingProfile = JSON.parse(localStorage.getItem(perfilKey));
    if (existingProfile) {
      welcomeMessage.textContent = `Bienvenido de vuelta, detective ${nombreInput}.`;
      perfilDetective = existingProfile;
    } else {
      welcomeMessage.textContent = `¡Bienvenido, nuevo detective ${nombreInput}!`;
      perfilDetective = {
        nombre: nombreInput,
        casosResueltos: 0,
        intentosTotales: 0,
      };
    }
    localStorage.setItem(perfilKey, JSON.stringify(perfilDetective));
    document.querySelector("#welcome-section").style.display = "none";
    document.querySelector("#game-section").style.display = "block";
    actualizarPerfil();
    mostrarMisterios();
  } else {
    errorMessage.style.display = "block";
  }
}

// Actualizar perfil del detective en el DOM
function actualizarPerfil() {
  document.querySelector("#detective-name").textContent =
    perfilDetective.nombre;
  document.querySelector("#casos-resueltos").textContent =
    perfilDetective.casosResueltos;
  document.querySelector("#intentos-totales").textContent =
    perfilDetective.intentosTotales;
}

// Mostrar lista de misterios pendientes
function mostrarMisterios() {
  const lista = document.querySelector("#misterios");
  lista.innerHTML = "";
  misterios.forEach((misterio, indice) => {
    const li = document.createElement("li");
    li.textContent = misterio.nombre;
    li.addEventListener("click", () => seleccionarMisterio(indice));
    lista.appendChild(li);
  });
}

// Seleccionar un misterio y mostrar opciones
function seleccionarMisterio(indice) {
  misterioActual = misterios[indice];
  intentos = 3;
  document.querySelector("#misterio-nombre").textContent =
    misterioActual.nombre;
  document.querySelector("#misterio-narrativa").textContent =
    misterioActual.narrativa;
  document.querySelector(
    "#intentos-restantes"
  ).textContent = `Intentos restantes: ${intentos}`;
  document.querySelector("#resultado").textContent = "";
  document.querySelector("#misterio-actual").style.display = "block";
  mostrarOpciones(
    "lugares",
    misterioActual.opciones.lugares,
    misterioActual.pistas.lugar
  );
}

// Mostrar opciones dinámicas (lugares, objetos, sospechosos)
function mostrarOpciones(tipo, array, pista) {
  const div = document.querySelector(`#opciones-${tipo}`);
  div.innerHTML = `<p>Pista: ${pista}</p>`;
  div.style.display = "block";
  array.forEach((opcion) => {
    const button = document.createElement("button");
    button.textContent = opcion;
    button.addEventListener("click", () => {
      verificarEleccion(tipo, opcion, button);
    });
    div.appendChild(button);
  });
}

// Verificar la elección del usuario
function verificarEleccion(tipo, eleccion, button) {
  let correcto;
  if (tipo === "lugares") {
    correcto = eleccion === misterioActual.lugarCorrecto;
    button.classList.add(correcto ? "selected-correct" : "selected-incorrect");
    if (correcto)
      mostrarOpciones(
        "objetos",
        misterioActual.opciones.objetos,
        misterioActual.pistas.objeto
      );
  } else if (tipo === "objetos") {
    correcto = eleccion === misterioActual.objetoCorrecto;
    button.classList.add(correcto ? "selected-correct" : "selected-incorrect");
    if (correcto)
      mostrarOpciones(
        "sospechosos",
        misterioActual.opciones.sospechosos,
        misterioActual.pistas.sospechoso
      );
  } else {
    correcto = eleccion === misterioActual.sospechosoCorrecto;
    button.classList.add(correcto ? "selected-correct" : "selected-incorrect");
    if (correcto) resolverExito();
  }

  if (!correcto) {
    intentos--;
    perfilDetective.intentosTotales++;
    document.querySelector(
      "#intentos-restantes"
    ).textContent = `Intentos restantes: ${intentos}`;
    if (intentos === 0) resolverFallo();
  }
  localStorage.setItem(
    `perfilDetective_${perfilDetective.nombre}`,
    JSON.stringify(perfilDetective)
  );
  actualizarPerfil();
}

// Resolver con éxito
function resolverExito() {
  perfilDetective.casosResueltos++;
  document.querySelector("#resultado").textContent =
    "¡Felicidades! Has resuelto el misterio.";
  misterios.splice(misterios.indexOf(misterioActual), 1);
  reiniciarMisterio();
}

// Resolver con fallo
function resolverFallo() {
  document.querySelector(
    "#resultado"
  ).textContent = `No has resuelto el misterio. La solución era:\nLugar: ${misterioActual.lugarCorrecto}\nObjeto: ${misterioActual.objetoCorrecto}\nSospechoso: ${misterioActual.sospechosoCorrecto}`;
}

// Reiniciar misterio
function reiniciarMisterio() {
  document.querySelector("#misterio-actual").style.display = "none";
  document.querySelector("#opciones-lugares").style.display = "none";
  document.querySelector("#opciones-objetos").style.display = "none";
  document.querySelector("#opciones-sospechosos").style.display = "none";
  mostrarMisterios();
}

document
  .querySelector("#reiniciar")
  .addEventListener("click", reiniciarMisterio);
