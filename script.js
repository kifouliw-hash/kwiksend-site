const sound = document.getElementById("bird-sound");
const toggleBtn = document.getElementById("sound-toggle");

// Par défaut, le son est en pause
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
