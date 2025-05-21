import { misterios } from "./misteriosData.js";

// Estado del juego (similar a gameState de NewIndex, pero adaptado)
let gameState = {
  nombreDetective: "",
  casosResueltos: 0,
  intentosTotalesGlobal: 0, // Intentos totales en todos los juegos
  misterioActualData: null, // Objeto del misterio actual de misteriosData.js
  intentosRestantesMisterio: 3,
  libreta: "",
  misteriosDisponibles: [], // Copia de la lista de misterios para poder removerlos
  etapaActual: "", // 'lugares', 'objetos', 'sospechosos'
};

// DOM Elements
const welcomeSection = document.getElementById("welcome-section");
const gameSection = document.getElementById("game-section");
const nameForm = document.getElementById("name-form");
const welcomeMessageContainer = document.getElementById(
  "welcome-message-container"
);
const welcomeText = document.getElementById("welcome-text");
const continueBtn = document.getElementById("continue-btn");
const detectiveNameInput = document.getElementById("detective-name-input");
const errorMessage = document.getElementById("error-message");
const startGameBtn = document.getElementById("start-game"); // Renombrado para claridad

const detectiveNameDisplay = document.getElementById("detective-name-display");
const casosResueltosDisplay = document.getElementById("casos-resueltos");
const intentosTotalesDisplay = document.getElementById("intentos-totales");

const misteriosListContainer = document.getElementById(
  "misterios-list-container"
); // Contenedor de la lista de misterios
const misteriosListDiv = document.getElementById("misterios"); // El div que contendrá las tarjetas de misterio

const misterioActualDiv = document.getElementById("misterio-actual");
const misterioNombreDisplay = document.getElementById("misterio-nombre");
const misterioNarrativaDisplay = document.getElementById("misterio-narrativa");
const intentosRestantesDisplay = document.getElementById(
  "intentos-restantes-display"
);
const pistaActualDisplay = document.getElementById("pista-actual");

const opcionesLugaresDiv = document.getElementById("opciones-lugares");
const opcionesObjetosDiv = document.getElementById("opciones-objetos");
const opcionesSospechososDiv = document.getElementById("opciones-sospechosos");

const resultadoAreaDiv = document.getElementById("resultado-area");
const resultadoDisplay = document.getElementById("resultado"); // Donde se muestra el texto del resultado

const backToCasesBtn = document.getElementById("back-to-cases");
const reiniciarMisterioBtn = document.getElementById("reiniciar-misterio-btn");

const notebookEntry = document.getElementById("notebook-entry");
const notebookInput = document.getElementById("notebook-input");
const saveNotesBtn = document.getElementById("save-notes");

const solvedModal = document.getElementById("solved-modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalSolutionText = document.getElementById("modal-solution-text");
const closeModalBtn = document.getElementById("close-modal");
const nextCaseBtn = document.getElementById("next-case-btn");
const featuredCasesDiv = document.getElementById("featured-cases");

// Inicializar el juego
document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
  const savedState = localStorage.getItem("simuladorMisteriosState_v2");
  if (savedState) {
    gameState = JSON.parse(savedState);
    // Asegurarse de que misteriosDisponibles se carga correctamente si no está en el estado guardado o está vacío
    if (
      !gameState.misteriosDisponibles ||
      gameState.misteriosDisponibles.length === 0
    ) {
      gameState.misteriosDisponibles = [...misterios]; // Cargar lista fresca si no hay progreso guardado o se completaron todos
    }
    showWelcomeBack();
  } else {
    gameState.misteriosDisponibles = [...misterios]; // Copia inicial
    showNewPlayerWelcome();
  }
  loadFeaturedCases();

  detectiveNameInput.addEventListener("keydown", () => {
    errorMessage.classList.add("hidden");
  });

  startGameBtn.addEventListener("click", handleStartGame);
  continueBtn.addEventListener("click", continueGame);
  backToCasesBtn.addEventListener("click", showMysteriesScreen);
  reiniciarMisterioBtn.addEventListener("click", resetCurrentMysteryState);
  saveNotesBtn.addEventListener("click", saveNotebook);
  closeModalBtn.addEventListener("click", closeSolvedModal);
  nextCaseBtn.addEventListener("click", closeSolvedModal);
}

function loadFeaturedCases() {
  featuredCasesDiv.innerHTML = "";
  const numFeatured = Math.min(3, misterios.length);
  const colors = ["amber", "red", "green"];
  for (let i = 0; i < numFeatured; i++) {
    const misterio = misterios[i];
    const color = colors[i % colors.length];
    const caseDiv = document.createElement("div");
    caseDiv.className = `bg-gray-800 p-4 rounded border-l-4 border-${color}-600 glow`;
    caseDiv.innerHTML = `
            <h3 class="title-font text-lg text-${color}-400 mb-2">${
      misterio.nombre
    }</h3>
            <p class="text-gray-400 text-sm">${misterio.narrativa.substring(
              0,
              70
            )}...</p>
        `;
    featuredCasesDiv.appendChild(caseDiv);
  }
}

function showWelcomeBack() {
  nameForm.classList.add("hidden");
  welcomeText.textContent = `Bienvenido de vuelta, detective ${gameState.nombreDetective}. ¿Listo para continuar?`;
  welcomeMessageContainer.classList.remove("hidden");
  errorMessage.classList.add("hidden");
}

function showNewPlayerWelcome() {
  nameForm.classList.remove("hidden");
  welcomeMessageContainer.classList.add("hidden");
  errorMessage.classList.add("hidden");
}

function handleStartGame() {
  const nombre = detectiveNameInput.value.trim();
  if (!nombre) {
    errorMessage.classList.remove("hidden");
    return;
  }

  gameState.nombreDetective = nombre;
  // No reiniciar casos resueltos o intentos si el nombre ya existía y se está continuando.
  // Esta función es para un inicio "fresco" o un nuevo nombre.
  // Si se quisiera una lógica de perfiles múltiples, se necesitaría un manejo más complejo aquí.
  // Por ahora, si el nombre es nuevo, se resetean estas estadísticas.
  const existingProfile = localStorage.getItem("simuladorMisteriosState_v2");
  if (existingProfile) {
    const parsedProfile = JSON.parse(existingProfile);
    if (parsedProfile.nombreDetective !== nombre) {
      // Nuevo detective
      gameState.casosResueltos = 0;
      gameState.intentosTotalesGlobal = 0;
      gameState.libreta = "";
      gameState.misteriosDisponibles = [...misterios];
    }
  } else {
    // No hay perfil existente en absoluto
    gameState.casosResueltos = 0;
    gameState.intentosTotalesGlobal = 0;
    gameState.libreta = "";
    gameState.misteriosDisponibles = [...misterios];
  }

  saveGameState();
  transitionToGameSection();
}

function continueGame() {
  transitionToGameSection();
}

function transitionToGameSection() {
  welcomeSection.classList.add("hidden");
  gameSection.classList.remove("hidden");
  updateDetectiveProfileDisplay();
  renderMysteriesList();
  showMysteriesScreen(); // Asegura que se muestre la lista de misterios
}

function updateDetectiveProfileDisplay() {
  detectiveNameDisplay.textContent = gameState.nombreDetective;
  casosResueltosDisplay.textContent = gameState.casosResueltos;
  intentosTotalesDisplay.textContent = gameState.intentosTotalesGlobal;
  notebookEntry.textContent = gameState.libreta || "Aún no hay notas...";
  notebookInput.value = gameState.libreta || "";
}

function renderMysteriesList() {
  misteriosListDiv.innerHTML = "";
  if (gameState.misteriosDisponibles.length === 0) {
    misteriosListDiv.innerHTML = `<p class="text-gray-400 col-span-full text-center">¡Felicidades, detective! Ha resuelto todos los casos disponibles.</p>`;
    return;
  }

  gameState.misteriosDisponibles.forEach((misterio) => {
    const misterioCard = document.createElement("div");
    misterioCard.className =
      "bg-gray-800 p-4 rounded border-l-4 border-amber-600 glow cursor-pointer hover:bg-gray-700 transition-colors";
    misterioCard.innerHTML = `
      <h3 class="title-font text-lg text-amber-400 mb-2">${misterio.nombre}</h3>
      <p class="text-gray-400 text-sm mb-3">${misterio.narrativa.substring(
        0,
        100
      )}...</p>
      <button class="bg-amber-700 hover:bg-amber-600 text-white text-sm px-3 py-1 rounded glow select-mystery-btn" data-misterio-nombre="${
        misterio.nombre
      }">
          Investigar <i class="fas fa-search ml-1"></i>
      </button>
    `;
    misteriosListDiv.appendChild(misterioCard);
  });

  document.querySelectorAll(".select-mystery-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const nombreMisterio = this.getAttribute("data-misterio-nombre");
      selectMystery(nombreMisterio);
    });
  });
}

function selectMystery(nombreMisterio) {
  const misterioSeleccionado = gameState.misteriosDisponibles.find(
    (m) => m.nombre === nombreMisterio
  );
  if (!misterioSeleccionado) return;

  gameState.misterioActualData = misterioSeleccionado;
  gameState.intentosRestantesMisterio = 3;
  gameState.etapaActual = "lugares"; // Iniciar siempre por lugares

  misterioNombreDisplay.textContent = gameState.misterioActualData.nombre;
  misterioNarrativaDisplay.innerHTML = `<p>${gameState.misterioActualData.narrativa}</p>`;
  intentosRestantesDisplay.textContent = gameState.intentosRestantesMisterio;

  resultadoDisplay.textContent = "";
  resultadoAreaDiv.classList.add("hidden");
  pistaActualDisplay.style.display = "none";

  renderOptionsForEtapa();

  misteriosListContainer.classList.add("hidden");
  misterioActualDiv.classList.remove("hidden");
}

function renderOptionsForEtapa() {
  // Limpiar y ocultar todas las opciones primero
  opcionesLugaresDiv.innerHTML = "";
  opcionesObjetosDiv.innerHTML = "";
  opcionesSospechososDiv.innerHTML = "";

  opcionesLugaresDiv.style.display = "none";
  opcionesObjetosDiv.style.display = "none";
  opcionesSospechososDiv.style.display = "none";
  pistaActualDisplay.style.display = "none";

  let opcionesArray;
  let pistaParaEtapa;
  let divParaOpciones;

  switch (gameState.etapaActual) {
    case "lugares":
      opcionesArray = gameState.misterioActualData.opciones.lugares;
      pistaParaEtapa = gameState.misterioActualData.pistas.lugar;
      divParaOpciones = opcionesLugaresDiv;
      opcionesLugaresDiv.style.display = "block";
      break;
    case "objetos":
      opcionesArray = gameState.misterioActualData.opciones.objetos;
      pistaParaEtapa = gameState.misterioActualData.pistas.objeto;
      divParaOpciones = opcionesObjetosDiv;
      opcionesObjetosDiv.style.display = "block";
      break;
    case "sospechosos":
      opcionesArray = gameState.misterioActualData.opciones.sospechosos;
      pistaParaEtapa = gameState.misterioActualData.pistas.sospechoso;
      divParaOpciones = opcionesSospechososDiv;
      opcionesSospechososDiv.style.display = "block";
      break;
    default:
      return;
  }

  // Mostrar pista general para la etapa actual
  if (pistaParaEtapa) {
    pistaActualDisplay.textContent = `Pista: ${pistaParaEtapa}`;
    pistaActualDisplay.style.display = "block";
  }

  opcionesArray.forEach((opcionTexto) => {
    const button = document.createElement("button");
    // Tailwind classes applied via global style for these buttons now
    button.textContent = opcionTexto;
    button.addEventListener("click", () =>
      verificarEleccion(opcionTexto, button)
    );
    divParaOpciones.appendChild(button);
  });
}

function verificarEleccion(eleccion, buttonElement) {
  if (!gameState.misterioActualData || gameState.intentosRestantesMisterio <= 0)
    return;

  let esCorrecto = false;
  let etapaSuperada = false;

  // Deshabilitar todos los botones de la etapa actual para prevenir clics múltiples
  const currentOptionButtons =
    buttonElement.parentElement.querySelectorAll("button");
  currentOptionButtons.forEach((btn) => (btn.disabled = true));

  switch (gameState.etapaActual) {
    case "lugares":
      esCorrecto = eleccion === gameState.misterioActualData.lugarCorrecto;
      if (esCorrecto) {
        gameState.etapaActual = "objetos";
        etapaSuperada = true;
      }
      break;
    case "objetos":
      esCorrecto = eleccion === gameState.misterioActualData.objetoCorrecto;
      if (esCorrecto) {
        gameState.etapaActual = "sospechosos";
        etapaSuperada = true;
      }
      break;
    case "sospechosos":
      esCorrecto = eleccion === gameState.misterioActualData.sospechosoCorrecto;
      if (esCorrecto) {
        resolverMisterioConExito();
        return; // Termina la función aquí si se resuelve con éxito
      }
      break;
  }

  buttonElement.classList.add(
    esCorrecto ? "selected-correct" : "selected-incorrect"
  );

  if (!esCorrecto) {
    gameState.intentosRestantesMisterio--;
    gameState.intentosTotalesGlobal++;
    intentosRestantesDisplay.textContent = gameState.intentosRestantesMisterio;
    updateDetectiveProfileDisplay(); // Actualizar intentos totales globales
    resultadoDisplay.textContent =
      "Incorrecto. Te quedan " +
      gameState.intentosRestantesMisterio +
      " intentos.";
    resultadoAreaDiv.classList.remove("hidden");

    if (gameState.intentosRestantesMisterio <= 0) {
      resolverMisterioConFallo();
      return;
    }
    // Si es incorrecto pero quedan intentos, permitir seleccionar otra opción de la misma etapa
    currentOptionButtons.forEach((btn) => {
      if (btn !== buttonElement) btn.disabled = false; // Reactivar otros botones si no fueron el incorrecto
    });
  } else {
    // Es correcto
    resultadoDisplay.textContent = "¡Correcto! Pasando a la siguiente etapa...";
    resultadoAreaDiv.classList.remove("hidden");
    // Ocultar pista de la etapa anterior y renderizar opciones para la nueva etapa después de un breve delay
    pistaActualDisplay.style.display = "none";
    setTimeout(() => {
      resultadoAreaDiv.classList.add("hidden"); // Ocultar mensaje de "Correcto!"
      renderOptionsForEtapa();
    }, 1500);
  }
  saveGameState();
}

function resolverMisterioConExito() {
  gameState.casosResueltos++;

  // Remover el misterio resuelto de la lista de disponibles
  gameState.misteriosDisponibles = gameState.misteriosDisponibles.filter(
    (m) => m.nombre !== gameState.misterioActualData.nombre
  );

  updateDetectiveProfileDisplay();
  saveGameState();

  modalIcon.innerHTML = '<i class="fas fa-trophy"></i>';
  modalTitle.textContent = "¡Caso Resuelto!";
  modalSolutionText.innerHTML = `
    <p class="mb-4">¡Felicidades, detective! Has resuelto el misterio "${gameState.misterioActualData.nombre}".</p>
    <p class="mb-2"><strong>Lugar:</strong> ${gameState.misterioActualData.lugarCorrecto}</p>
    <p class="mb-2"><strong>Objeto:</strong> ${gameState.misterioActualData.objetoCorrecto}</p>
    <p><strong>Sospechoso:</strong> ${gameState.misterioActualData.sospechosoCorrecto}</p>
  `;
  solvedModal.classList.remove("hidden");
}

function resolverMisterioConFallo() {
  gameState.intentosTotalesGlobal++; // Contar el último intento fallido si agota intentos
  updateDetectiveProfileDisplay();
  saveGameState();

  modalIcon.innerHTML = '<i class="fas fa-times-circle text-red-500"></i>';
  modalTitle.textContent = "Misterio No Resuelto";
  modalSolutionText.innerHTML = `
    <p class="mb-4 text-red-300">No has resuelto el misterio "${gameState.misterioActualData.nombre}".</p>
    <p class="mb-2">La solución era:</p>
    <p class="mb-2"><strong>Lugar:</strong> ${gameState.misterioActualData.lugarCorrecto}</p>
    <p class="mb-2"><strong>Objeto:</strong> ${gameState.misterioActualData.objetoCorrecto}</p>
    <p><strong>Sospechoso:</strong> ${gameState.misterioActualData.sospechosoCorrecto}</p>
    <p class="mt-4 text-gray-400">Mejor suerte en tu próximo caso...</p>
  `;
  solvedModal.classList.remove("hidden");
}

function closeSolvedModal() {
  solvedModal.classList.add("hidden");
  showMysteriesScreen(); // Volver a la lista de misterios
}

function showMysteriesScreen() {
  misterioActualDiv.classList.add("hidden");
  misteriosListContainer.classList.remove("hidden");
  // Asegurarse de que los botones de opción estén ocultos si se vuelve sin terminar
  opcionesLugaresDiv.style.display = "none";
  opcionesObjetosDiv.style.display = "none";
  opcionesSospechososDiv.style.display = "none";
  pistaActualDisplay.style.display = "none";
  resultadoAreaDiv.classList.add("hidden");
  renderMysteriesList(); // Re-renderizar por si un misterio fue resuelto
}

function resetCurrentMysteryState() {
  if (gameState.misterioActualData) {
    // No reiniciar intentos totales globales, solo los del misterio actual
    gameState.intentosRestantesMisterio = 3;
    gameState.etapaActual = "lugares"; // Reiniciar a la primera etapa
    intentosRestantesDisplay.textContent = gameState.intentosRestantesMisterio;
    resultadoDisplay.textContent = "";
    resultadoAreaDiv.classList.add("hidden");
    pistaActualDisplay.style.display = "none";

    // Limpiar clases de botones seleccionados
    document
      .querySelectorAll(
        "#opciones-lugares button, #opciones-objetos button, #opciones-sospechosos button"
      )
      .forEach((btn) => {
        btn.classList.remove("selected-correct", "selected-incorrect");
        btn.disabled = false;
      });

    renderOptionsForEtapa(); // Re-renderizar opciones para la etapa inicial
    saveGameState();
  }
}

function saveNotebook() {
  gameState.libreta = notebookInput.value;
  notebookEntry.textContent = gameState.libreta || "Aún no hay notas...";
  saveGameState();
}

function saveGameState() {
  localStorage.setItem("simuladorMisteriosState_v2", JSON.stringify(gameState));
}
