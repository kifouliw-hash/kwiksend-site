// Exemple de dictionnaire de traductions
const translations = {
  fr: {
    menu_home: "Accueil",
    menu_features: "Fonctionnalités",
    menu_advantages: "Avantages",
    menu_about: "À propos",
    menu_login: "Connexion",

    headline: "Votre argent partout tout de suite 🌍",
    subtitle: "La nouvelle façon d’envoyer et de recevoir de l’argent entre l’Afrique et l’Europe.",
    cta_join: "Rejoindre la liste d’attente",

    features_title: "Ce que vous pouvez faire avec KwikSend",
    feature_wallet: "💰 Portefeuille numérique",
    feature_wallet_desc: "Gérez votre argent facilement en FCFA et en Euro, où que vous soyez.",
    feature_transfer: "🌐 Transferts Afrique ↔ Europe",
    feature_transfer_desc: "Envoyez ou recevez instantanément entre l’Afrique et l’Europe, sans tracas.",
    feature_p2p: "👥 Transferts KwikSend ↔ KwikSend",
    feature_p2p_desc: "Transférez gratuitement ou à petit coût entre utilisateurs KwikSend.",
    feature_mobile: "🏦 Mobile Money & IBAN",
    feature_mobile_desc: "Alimentez ou retirez facilement via Orange Money, Wave ou compte bancaire européen.",

    advantages_title: "Pourquoi choisir KwikSend ?",
    adv_speed: "⚡ Rapidité : transferts instantanés.",
    adv_security: "🔒 Sécurité : transactions chiffrées et protégées.",
    adv_access: "🌍 Accessibilité : utilisable en Afrique et en Europe.",
    adv_flex: "💳 Flexibilité : multiples moyens de retrait et de paiement.",

    about_title: "À propos",
    about_text: "KwikSend est une solution moderne de transfert d’argent pensée pour connecter l’Afrique et l’Europe, en offrant rapidité, simplicité et sécurité.",
    footer: "© 2025 KwikSend. Tous droits réservés.",

    wallet_page_title: "Portefeuille - KwikSend",
    wallet_recharge: "Alimenter le portefeuille",
    send: "📤 Envoyer",
    receive: "📥 Recevoir",
    withdraw: "🏦 Retrait",
    virtual_card: "💳 Carte virtuelle",
    history_title: "Historique des transactions",
    history_date: "Date",
    history_type: "Type",
    history_amount: "Montant",
    history_status: "Statut",
    status_done: "Terminé",
    nav_home: "⬅ Accueil"
  },

  en: {
    menu_home: "Home",
    menu_features: "Features",
    menu_advantages: "Advantages",
    menu_about: "About",
    menu_login: "Login",

    headline: "Your money, everywhere, instantly 🌍",
    subtitle: "The new way to send and receive money between Africa and Europe.",
    cta_join: "Join the waiting list",

    features_title: "What you can do with KwikSend",
    feature_wallet: "💰 Digital Wallet",
    feature_wallet_desc: "Easily manage your money in CFA and Euro, wherever you are.",
    feature_transfer: "🌐 Africa ↔ Europe Transfers",
    feature_transfer_desc: "Send or receive instantly between Africa and Europe, hassle-free.",
    feature_p2p: "👥 KwikSend ↔ KwikSend Transfers",
    feature_p2p_desc: "Transfer for free or at low cost between KwikSend users.",
    feature_mobile: "🏦 Mobile Money & IBAN",
    feature_mobile_desc: "Easily fund or withdraw via Orange Money, Wave, or European bank accounts.",

    advantages_title: "Why choose KwikSend?",
    adv_speed: "⚡ Speed: instant transfers.",
    adv_security: "🔒 Security: encrypted and protected transactions.",
    adv_access: "🌍 Accessibility: usable in Africa and Europe.",
    adv_flex: "💳 Flexibility: multiple withdrawal and payment options.",

    about_title: "About",
    about_text: "KwikSend is a modern money transfer solution designed to connect Africa and Europe, offering speed, simplicity, and security.",
    footer: "© 2025 KwikSend. All rights reserved.",

    wallet_page_title: "Wallet - KwikSend",
    wallet_recharge: "Top up wallet",
    send: "📤 Send",
    receive: "📥 Receive",
    withdraw: "🏦 Withdraw",
    virtual_card: "💳 Virtual Card",
    history_title: "Transaction History",
    history_date: "Date",
    history_type: "Type",
    history_amount: "Amount",
    history_status: "Status",
    status_done: "Completed",
    nav_home: "⬅ Home"
  }
  // tu ajoutes aussi ES 🇪🇸 et PT 🇵🇹 ici (même structure)
};

// 🌍 Fonction traduction
function translatePage(lang) {
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  localStorage.setItem("lang", lang);
}

// 🌍 Charger langue sauvegardée
const savedLang = localStorage.getItem("lang") || "fr";
translatePage(savedLang);
document.getElementById("langSwitcher").value = savedLang;

// 🌍 Listener changement
document.getElementById("langSwitcher").addEventListener("change", (e) => {
  translatePage(e.target.value);
});
