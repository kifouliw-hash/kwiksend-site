// Exemple de dictionnaire de traductions
const translations = {
  fr: {
    headline: "Votre argent partout tout de suite 🌍",
    subtitle: "La nouvelle façon d’envoyer et de recevoir de l’argent entre l’Afrique et l’Europe.",
    join: "Rejoindre la liste d’attente",
    features_title: "Ce que vous pouvez faire avec KwikSend",
    wallet: "💰 Portefeuille numérique",
    wallet_text: "Gérez votre argent facilement en FCFA et en Euro, où que vous soyez."
  },
  en: {
    headline: "Your money, everywhere, instantly 🌍",
    subtitle: "The new way to send and receive money between Africa and Europe.",
    join: "Join the waiting list",
    features_title: "What you can do with KwikSend",
    wallet: "💰 Digital Wallet",
    wallet_text: "Easily manage your money in CFA and Euro, wherever you are."
  },
  es: {
    headline: "Tu dinero, en todas partes, al instante 🌍",
    subtitle: "La nueva forma de enviar y recibir dinero entre África y Europa.",
    join: "Únete a la lista de espera",
    features_title: "Lo que puedes hacer con KwikSend",
    wallet: "💰 Billetera digital",
    wallet_text: "Administra fácilmente tu dinero en CFA y Euro, dondequiera que estés."
  },
  pt: {
    headline: "Seu dinheiro, em qualquer lugar, instantaneamente 🌍",
    subtitle: "A nova forma de enviar e receber dinheiro entre África e Europa.",
    join: "Entrar na lista de espera",
    features_title: "O que você pode fazer com o KwikSend",
    wallet: "💰 Carteira Digital",
    wallet_text: "Gerencie facilmente seu dinheiro em CFA e Euro, onde quer que esteja."
  }
};

// Fonction pour appliquer la traduction
function applyTranslations(lang) {
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Récupérer la langue sauvegardée ou défaut FR
let currentLang = localStorage.getItem("lang") || "fr";
applyTranslations(currentLang);
document.getElementById("langSwitcher").value = currentLang;

// Quand on change la langue
document.getElementById("langSwitcher").addEventListener("change", (e) => {
  currentLang = e.target.value;
  localStorage.setItem("lang", currentLang); // ✅ sauvegarde dans localStorage
  applyTranslations(currentLang);
});
