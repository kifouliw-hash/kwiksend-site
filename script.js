document.addEventListener("DOMContentLoaded", () => {
  console.log("KwikSend site Afrique chargé avec son !");
  
  const audio = document.getElementById("birds-sound");

  // Volume doux pour pas déranger
  audio.volume = 0.2;

  // Exemple : bouton pour couper/remettre le son
  const toggleSound = document.createElement("button");
  toggleSound.innerText = "🔊 Couper le son";
  toggleSound.style.position = "fixed";
  toggleSound.style.bottom = "10px";
  toggleSound.style.right = "10px";
  toggleSound.style.padding = "8px 12px";
  toggleSound.style.border = "none";
  toggleSound.style.borderRadius = "5px";
  toggleSound.style.cursor = "pointer";
  toggleSound.style.background = "#ff6600";
  toggleSound.style.color = "#fff";

  document.body.appendChild(toggleSound);

  let playing = true;
  toggleSound.addEventListener("click", () => {
    if (playing) {
      audio.pause();
      toggleSound.innerText = "🔇 Remettre le son";
    } else {
      audio.play();
      toggleSound.innerText = "🔊 Couper le son";
    }
    playing = !playing;
  });
});
// Contrôle du son
const birdSound = document.getElementById('bird-sound');
const toggleSound = document.getElementById('toggle-sound');

let isPlaying = false;

toggleSound.addEventListener('click', () => {
  if (!isPlaying) {
    birdSound.play();
    toggleSound.textContent = "🔇 Couper le son";
  } else {
    birdSound.pause();
    toggleSound.textContent = "🔊 Activer le son";
  }
  isPlaying = !isPlaying;
});
