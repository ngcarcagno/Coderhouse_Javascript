class AudioManager {
  constructor() {
    // Initialize sounds
    this.backgroundMusic = new Howl({
      src: ["data/sounds/music_MainBackground_Loop.ogg"],
      loop: true,
      volume: 0.7,
    });

    this.cluePositive = new Howl({
      src: ["data/sounds/sfx_CluePositive.ogg"],
      volume: 0.7,
    });

    this.clueNegative = new Howl({
      src: ["data/sounds/sfx_ClueNegative.ogg"],
      volume: 0.7,
    });

    this.mysterySuccess = new Howl({
      src: ["data/sounds/sfx_MisterySuccess.ogg"],
      volume: 0.7,
    });

    this.mysteryFail = new Howl({
      src: ["data/sounds/sfx_MisteryFail.ogg"],
      volume: 0.7,
    });

    this.welcomeMessage = new Howl({
      src: ["data/sounds/sfx_WelcomeMessage.ogg"],
      volume: 0.7,
    });

    // Track playback state
    this.isMusicPlaying = false;

    // Track playback state
    this.isMusicPlayingVisibilityCache = false;

    // Add visibility change listener
    document.addEventListener("visibilitychange", () => this.handleVisibilityChange());
  }

  // Play background music
  playBackgroundMusic() {
    if (!this.isMusicPlaying) {
      this.backgroundMusic.play();
      this.isMusicPlaying = true;
    } else {
      this.backgroundMusic.play();
    }
  }

  // Pause background music
  pauseBackgroundMusic() {
    if (this.isMusicPlaying) {
      this.backgroundMusic.pause();
      this.isMusicPlaying = false;
    }
  }

  // Toggle background music
  toggleMusic() {
    if (this.isMusicPlaying) {
      this.pauseBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
    return this.isMusicPlaying;
  }

  // Play sound effects
  playCluePositive() {
    this.cluePositive.play();
  }

  playClueNegative() {
    this.clueNegative.play();
  }

  playMysterySuccess() {
    this.mysterySuccess.play();
  }

  playMysteryFail() {
    this.mysteryFail.play();
  }

  playWelcomeMessage() {
    this.welcomeMessage.play();
  }

  // Set master volume for all sounds
  setMasterVolume(volume) {
    this.backgroundMusic.volume(volume);
    this.welcomeMessage.volume(volume);
    this.cluePositive.volume(volume);
    this.clueNegative.volume(volume);
    this.mysterySuccess.volume(volume);
    this.mysteryFail.volume(volume);
  }

  // Get current playback state
  getMusicPlayingState() {
    return this.isMusicPlaying;
  }

  // Handle tab visibility change
  handleVisibilityChange() {
    if (document.hidden) {
      this.isMusicPlayingVisibilityCache = this.isMusicPlaying; // Cache the current state
      this.pauseBackgroundMusic(); // Pause when tab is not visible
    } else if (this.isMusicPlayingVisibilityCache) {
      this.playBackgroundMusic(); // Resume when tab becomes visible, if it was playing
    }
  }
}

// Export a singleton instance
const audioManager = new AudioManager();
export default audioManager;
