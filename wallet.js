// 💰 Simulation rechargement
function simulateTopup() {
  alert("🔄 Simulation : Rechargement du portefeuille !");
}

// 📤 Simulation envoi
function simulateSend() {
  alert("📤 Simulation : Envoyer de l'argent !");
}

// 📥 Simulation réception
function simulateReceive() {
  alert("📥 Simulation : Recevoir de l'argent !");
}

// 🏦 Simulation retrait
function simulateWithdraw() {
  alert("🏦 Simulation : Retrait IBAN / Mobile Money !");
}

// 💳 Simulation carte virtuelle
function simulateCard() {
  const container = document.getElementById("virtual-card-container");
  container.style.display = "block";

  // ⚡ Générer numéro aléatoire factice
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const cardNumber = `**** **** **** ${randomNum}`;

  // Insérer dans la carte
  container.querySelector(".card-number").innerText = cardNumber;

  // Notif visuelle
  alert("💳 Carte virtuelle générée !");
}


// 🔢 Simulation frais
function simulateFees() {
  let amount = document.querySelector(".wallet-simulator input").value;
  if (!amount) {
    document.getElementById("fees-result").innerText = "⚠️ Entrez un montant.";
    return;
  }
  let fees = (amount * 0.02).toFixed(2);
  document.getElementById("fees-result").innerText =
    `Frais estimés : ${fees} FCFA (simulation).`;
}
