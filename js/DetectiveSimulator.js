import audioManager from "./AudioManager.js";

let misterios = [];
let savedDetectiveName = ""; // Added to store the name found in localStorage

async function loadMisterios() {
  try {
    const response = await fetch("data/misteriosData.json");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    misterios = data.misterios;
  } catch (error) {
    console.error("Error loading misteriosData.json:", error);
  }
}

// Estado del juego
let gameState = {
  nombreDetective: "",
  casosResueltos: 0,
  intentosTotalesGlobal: 0,
  misterioActualData: null,
  intentosRestantesMisterio: 3,
  libreta: [], // Changed to an array to store multiple notes
  misteriosDisponibles: [],
  etapaActual: "",
  isMusicPlaying: false, // Track audio playback state
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
const startGameBtn = document.getElementById("start-game");
const detectiveNameDisplay = document.getElementById("detective-name-display");
const casosResueltosDisplay = document.getElementById("casos-resueltos");
const intentosTotalesDisplay = document.getElementById("intentos-totales");
const misteriosListContainer = document.getElementById(
  "misterios-list-container"
);
const misteriosListDiv = document.getElementById("misterios");
const misterioActualDiv = document.getElementById("misterio-actual");
const misterioNombreDisplay = document.getElementById("misterio-nombre");
const misterioImagen = document.getElementById("misterio-imagen");
const misterioNarrativaDisplay = document.getElementById("misterio-narrativa");
const intentosRestantesDisplay = document.getElementById(
  "intentos-restantes-display"
);
const pistaActualDisplay = document.getElementById("pista-actual");
const opcionesLugaresDiv = document.getElementById("opciones-lugares");
const opcionesObjetosDiv = document.getElementById("opciones-objetos");
const opcionesSospechososDiv = document.getElementById("opciones-sospechosos");
const resultadoAreaDiv = document.getElementById("resultado-area");
const resultadoDisplay = document.getElementById("resultado");
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
const audioToggleBtn = document.getElementById("audio-toggle");
const audioVolumeInput = document.getElementById("audio-volume");

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  const shuffled = [...array]; // Create a copy to avoid modifying the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
}

// Inicializar el juego
document.addEventListener("DOMContentLoaded", async () => {
  await loadMisterios();
  initGame();
});

async function initGame() {
  const savedState = localStorage.getItem("misteriosSinResolver_save");
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    savedDetectiveName = parsedState.nombreDetective || "";
    if (savedDetectiveName) {
      // Show modal to ask if user wants to continue
      const modal = document.createElement("div");
      modal.id = "reset-modal";
      modal.className =
        "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50";
      modal.innerHTML = `
        <div class="bg-gray-900 border-2 border-amber-600 rounded-lg p-8 max-w-md w-full relative slide-in">
          <div class="text-center">
            <h3 class="title-font text-2xl text-amber-400 mb-4">
              ¿Continuar Investigación?
            </h3>
            <p class="text-gray-300 mb-6">
              Se encontró una investigación previa de ${savedDetectiveName}. ¿Deseas continuar con esta investigación?
            </p>
            <p class="text-gray-500 italic text-sm mt-2">
              (En caso de que elijas "No", se reiniciará la investigación y se perderán los datos guardados.)
            </p>
            <div class="flex justify-center space-x-4">
              <button id="continue-investigation" class="bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-md glow">
                Sí, Continuar
              </button>
              <button id="reset-investigation" class="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-md glow">
                No, Empezar de Nuevo
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document
        .getElementById("continue-investigation")
        .addEventListener("click", () => {
          gameState = parsedState;
          if (
            !gameState.misteriosDisponibles ||
            gameState.misteriosDisponibles.length === 0
          ) {
            gameState.misteriosDisponibles = [...misterios];
          }
          // Ensure libreta is an array, even if loaded as a string
          if (!Array.isArray(gameState.libreta)) {
            gameState.libreta = gameState.libreta ? [gameState.libreta] : [];
          }
          modal.remove();
          continueGameInitialization();
        });

      document
        .getElementById("reset-investigation")
        .addEventListener("click", () => {
          localStorage.removeItem("misteriosSinResolver_save");
          gameState.nombreDetective = "";
          gameState.casosResueltos = 0;
          gameState.intentosTotalesGlobal = 0;
          gameState.libreta = [];
          gameState.misteriosDisponibles = [...misterios];
          gameState.misterioActualData = null;
          gameState.intentosRestantesMisterio = 3;
          gameState.etapaActual = "";
          gameState.isMusicPlaying = false;
          modal.remove();
          continueGameInitialization();
        });
    } else {
      continueGameInitialization();
    }
  } else {
    continueGameInitialization();
  }
}

// Split initialization logic to reuse after modal decision
function continueGameInitialization() {
  if (gameState.nombreDetective) {
    showWelcomeBack();
  } else {
    showNewPlayerWelcome();
  }
  loadFeaturedCases();

  // Initialize audio
  gameState.isMusicPlaying = audioManager.getMusicPlayingState();
  if (!gameState.isMusicPlaying) {
    audioManager.playBackgroundMusic();
  }
  updateAudioToggleIcon();

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
  audioToggleBtn.addEventListener("click", toggleAudio);
  audioVolumeInput.addEventListener("input", adjustVolume);
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
      <img src="${
        misterio.imageUrl
      }" class="w-full h-32 object-cover rounded mb-2" alt="${
      misterio.nombre
    }" />
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
  const existingProfile = localStorage.getItem("misteriosSinResolver_save");
  if (existingProfile) {
    const parsedProfile = JSON.parse(existingProfile);
    if (parsedProfile.nombreDetective !== nombre) {
      gameState.casosResueltos = 0;
      gameState.intentosTotalesGlobal = 0;
      gameState.libreta = [];
      gameState.misteriosDisponibles = [...misterios];
    }
  } else {
    gameState.casosResueltos = 0;
    gameState.intentosTotalesGlobal = 0;
    gameState.libreta = [];
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
  showMysteriesScreen();
}

function updateDetectiveProfileDisplay() {
  detectiveNameDisplay.textContent = gameState.nombreDetective;
  casosResueltosDisplay.textContent = gameState.casosResueltos;
  intentosTotalesDisplay.textContent = gameState.intentosTotalesGlobal;
  notebookEntry.textContent =
    gameState.libreta.length > 0
      ? gameState.libreta.join("\n")
      : "Aún no hay notas...";
  notebookInput.value = ""; // Ensure input is cleared on display update
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
      <img src="${
        misterio.imageUrl
      }" class="w-full h-40 object-cover rounded mb-3" alt="${
      misterio.nombre
    }" />
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
  gameState.etapaActual = "lugares";

  // Clear all option divs when starting a new mystery
  opcionesLugaresDiv.innerHTML = "";
  opcionesObjetosDiv.innerHTML = "";
  opcionesSospechososDiv.innerHTML = "";
  opcionesLugaresDiv.style.display = "none";
  opcionesObjetosDiv.style.display = "none";
  opcionesSospechososDiv.style.display = "none";

  misterioNombreDisplay.textContent = gameState.misterioActualData.nombre;
  misterioImagen.src = gameState.misterioActualData.imageUrl;
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
  let opcionesArray;
  let pistaParaEtapa;
  let divParaOpciones;

  // Only clear and set up the current stage's div, leaving others intact
  switch (gameState.etapaActual) {
    case "lugares":
      opcionesLugaresDiv.innerHTML = ""; // Clear only the current stage
      opcionesArray = gameState.misterioActualData.opciones.lugares;
      pistaParaEtapa = gameState.misterioActualData.pistas.lugar;
      divParaOpciones = opcionesLugaresDiv;
      opcionesLugaresDiv.style.display = "block";
      break;
    case "objetos":
      opcionesObjetosDiv.innerHTML = ""; // Clear only the current stage
      opcionesArray = gameState.misterioActualData.opciones.objetos;
      pistaParaEtapa = gameState.misterioActualData.pistas.objeto;
      divParaOpciones = opcionesObjetosDiv;
      opcionesObjetosDiv.style.display = "block";
      opcionesLugaresDiv.style.display = "block"; // Ensure previous stage remains visible
      break;
    case "sospechosos":
      opcionesSospechososDiv.innerHTML = ""; // Clear only the current stage
      opcionesArray = gameState.misterioActualData.opciones.sospechosos;
      pistaParaEtapa = gameState.misterioActualData.pistas.sospechoso;
      divParaOpciones = opcionesSospechososDiv;
      opcionesSospechososDiv.style.display = "block";
      opcionesLugaresDiv.style.display = "block"; // Ensure previous stages remain visible
      opcionesObjetosDiv.style.display = "block";
      break;
    default:
      return;
  }

  // Update the clue display
  if (pistaParaEtapa) {
    pistaActualDisplay.textContent = `Pista: ${pistaParaEtapa}`;
    pistaActualDisplay.style.display = "block";
  } else {
    pistaActualDisplay.style.display = "none";
  }

  // Shuffle the options before rendering
  const shuffledOpciones = shuffleArray(opcionesArray);

  shuffledOpciones.forEach((opcionTexto) => {
    const button = document.createElement("button");
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
        return;
      }
      break;
  }

  buttonElement.classList.add(
    esCorrecto ? "selected-correct" : "selected-incorrect"
  );

  if (!esCorrecto) {
    audioManager.playClueNegative();
    gameState.intentosRestantesMisterio--;
    gameState.intentosTotalesGlobal++;
    intentosRestantesDisplay.textContent = gameState.intentosRestantesMisterio;
    updateDetectiveProfileDisplay();
    resultadoDisplay.textContent = `Incorrecto. Te quedan ${gameState.intentosRestantesMisterio} intentos.`;
    resultadoAreaDiv.classList.remove("hidden");

    if (gameState.intentosRestantesMisterio <= 0) {
      resolverMisterioConFallo();
      return;
    }
    currentOptionButtons.forEach((btn) => {
      if (btn !== buttonElement) btn.disabled = false;
    });
  } else {
    audioManager.playCluePositive();
    resultadoDisplay.textContent = "¡Correcto! Pasando a la siguiente etapa...";
    resultadoAreaDiv.classList.remove("hidden");
    pistaActualDisplay.style.display = "none";
    setTimeout(() => {
      resultadoAreaDiv.classList.add("hidden");
      renderOptionsForEtapa();
    }, 1500);
  }
  saveGameState();
}

function resolverMisterioConExito() {
  gameState.casosResueltos++;
  gameState.misteriosDisponibles = gameState.misteriosDisponibles.filter(
    (m) => m.nombre !== gameState.misterioActualData.nombre
  );
  updateDetectiveProfileDisplay();
  saveGameState();

  audioManager.playMysterySuccess();
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
  gameState.intentosTotalesGlobal++;
  updateDetectiveProfileDisplay();
  saveGameState();

  audioManager.playMysteryFail();
  modalIcon.innerHTML = '<i class="fas fa-times-circle text-red-500"></i>';
  modalTitle.textContent = "Misterio No Resuelto";
  modalSolutionText.innerHTML = `
    <p class="mb-4 text-red-300">No has resuelto el misterio "${gameState.misterioActualData.nombre}".</p>
    <p class="mt-4 text-gray-400">Mejor suerte en tu próximo caso...</p>
  `;
  solvedModal.classList.remove("hidden");
}

function closeSolvedModal() {
  solvedModal.classList.add("hidden");
  showMysteriesScreen();
}

function showMysteriesScreen() {
  misterioActualDiv.classList.add("hidden");
  misteriosListContainer.classList.remove("hidden");
  opcionesLugaresDiv.style.display = "none";
  opcionesObjetosDiv.style.display = "none";
  opcionesSospechososDiv.style.display = "none";
  pistaActualDisplay.style.display = "none";
  resultadoAreaDiv.classList.add("hidden");
  renderMysteriesList();
}

function resetCurrentMysteryState() {
  if (gameState.misterioActualData) {
    gameState.intentosRestantesMisterio = 3;
    gameState.etapaActual = "lugares";
    intentosRestantesDisplay.textContent = gameState.intentosRestantesMisterio;
    resultadoDisplay.textContent = "";
    resultadoAreaDiv.classList.add("hidden");
    pistaActualDisplay.style.display = "none";

    // Clear all option divs when resetting the mystery
    opcionesLugaresDiv.innerHTML = "";
    opcionesObjetosDiv.innerHTML = "";
    opcionesSospechososDiv.innerHTML = "";
    opcionesLugaresDiv.style.display = "none";
    opcionesObjetosDiv.style.display = "none";
    opcionesSospechososDiv.style.display = "none";

    document
      .querySelectorAll(
        "#opciones-lugares button, #opciones-objetos button, #opciones-sospechosos button"
      )
      .forEach((btn) => {
        btn.classList.remove("selected-correct", "selected-incorrect");
        btn.disabled = false;
      });

    renderOptionsForEtapa();
    saveGameState();
  }
}

function saveNotebook() {
  const newNote = notebookInput.value.trim();
  if (newNote) {
    gameState.libreta.push(newNote); // Add new note to the array
    notebookEntry.textContent = gameState.libreta.join("\n"); // Display all notes with line breaks
    notebookInput.value = ""; // Clear the input field
    saveGameState();
  }
}

function saveGameState() {
  localStorage.setItem("misteriosSinResolver_save", JSON.stringify(gameState));
}

function toggleAudio() {
  gameState.isMusicPlaying = audioManager.toggleMusic();
  updateAudioToggleIcon();
  saveGameState();
}

function updateAudioToggleIcon() {
  audioToggleBtn.innerHTML = gameState.isMusicPlaying
    ? '<i class="fas fa-pause"></i>'
    : '<i class="fas fa-play"></i>';
}

function adjustVolume() {
  audioManager.setMasterVolume(audioVolumeInput.value);
}
