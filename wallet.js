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
  alert("💳 Simulation : Carte virtuelle générée !");
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
