const sound = document.getElementById("bird-sound");
const toggleBtn = document.getElementById("sound-toggle");

// Démarre avec le son coupé
toggleBtn.textContent = "🔊 Activer le son";

toggleBtn.addEventListener("click", () => {
  if (sound.paused) {
    sound.play();
    toggleBtn.textContent = "🔇 Couper le son";
  } else {
    sound.pause();
    toggleBtn.textContent = "🔊 Activer le son";
  }
});
