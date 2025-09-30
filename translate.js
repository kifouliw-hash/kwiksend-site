const translations = {
  fr: {
    menu_home: "Accueil",
    menu_features: "Fonctionnalités",
    menu_advantages: "Avantages",
    menu_about: "À propos",

    headline: "Votre argent partout tout de suite 🌍",
    subtitle: "La nouvelle façon d’envoyer et recevoir de l’argent entre l’Afrique et l’Europe.",
    cta_join: "Rejoindre la liste d’attente",

    features_title: "Nos fonctionnalités",
    feature_send: "Envoyer",
    feature_send_desc: "Transférez de l’Afrique vers l’Europe en quelques secondes.",
    feature_receive: "Recevoir",
    feature_receive_desc: "Recevez directement sur votre portefeuille KwikSend.",
    feature_withdraw: "Retrait bancaire",
    feature_withdraw_desc: "Virez vos fonds vers n’importe quel compte bancaire.",
    feature_card: "Carte & Code Cash",
    feature_card_desc: "Payez directement ou retirez en cash via un code sécurisé.",

    btn_test: "Tester",
    footer: "© 2025 KwikSend. Tous droits réservés."
  },

  en: {
    menu_home: "Home",
    menu_features: "Features",
    menu_advantages: "Advantages",
    menu_about: "About",

    headline: "Your money everywhere, instantly 🌍",
    subtitle: "The new way to send and receive money between Africa and Europe.",
    cta_join: "Join the waitlist",

    features_title: "Our Features",
    feature_send: "Send",
    feature_send_desc: "Transfer from Africa to Europe in just seconds.",
    feature_receive: "Receive",
    feature_receive_desc: "Receive directly into your KwikSend wallet.",
    feature_withdraw: "Bank Withdrawal",
    feature_withdraw_desc: "Send funds to any bank account.",
    feature_card: "Card & Cash Code",
    feature_card_desc: "Pay directly or withdraw with a secure code.",

    btn_test: "Try",
    footer: "© 2025 KwikSend. All rights reserved."
  },

  es: {
    menu_home: "Inicio",
    menu_features: "Funcionalidades",
    menu_advantages: "Ventajas",
    menu_about: "Acerca de",

    headline: "Tu dinero en todas partes, al instante 🌍",
    subtitle: "La nueva forma de enviar y recibir dinero entre África y Europa.",
    cta_join: "Unirse a la lista de espera",

    features_title: "Nuestras funcionalidades",
    feature_send: "Enviar",
    feature_send_desc: "Transfiere de África a Europa en segundos.",
    feature_receive: "Recibir",
    feature_receive_desc: "Recibe directamente en tu billetera KwikSend.",
    feature_withdraw: "Retiro bancario",
    feature_withdraw_desc: "Envía fondos a cualquier cuenta bancaria.",
    feature_card: "Tarjeta & Código Cash",
    feature_card_desc: "Paga directamente o retira en efectivo con un código seguro.",

    btn_test: "Probar",
    footer: "© 2025 KwikSend. Todos los derechos reservados."
  },

  pt: {
    menu_home: "Início",
    menu_features: "Funcionalidades",
    menu_advantages: "Vantagens",
    menu_about: "Sobre",

    headline: "O seu dinheiro em todo o lado, de imediato 🌍",
    subtitle: "A nova forma de enviar e receber dinheiro entre África e Europa.",
    cta_join: "Juntar-se à lista de espera",

    features_title: "As nossas funcionalidades",
    feature_send: "Enviar",
    feature_send_desc: "Transfira de África para a Europa em segundos.",
    feature_receive: "Receber",
    feature_receive_desc: "Receba diretamente na sua carteira KwikSend.",
    feature_withdraw: "Levantamento bancário",
    feature_withdraw_desc: "Envie fundos para qualquer conta bancária.",
    feature_card: "Cartão & Código Cash",
    feature_card_desc: "Pague diretamente ou levante em dinheiro com um código seguro.",

    btn_test: "Testar",
    footer: "© 2025 KwikSend. Todos os direitos reservados."
  }
};

// Sélecteur de langue
const langSwitcher = document.getElementById("langSwitcher");
const elements = document.querySelectorAll("[data-translate]");

function changeLang(lang) {
  elements.forEach(el => {
    const key = el.getAttribute("data-translate");
    el.textContent = translations[lang][key];
  });
}

// Détection et changement
langSwitcher.addEventListener("change", e => {
  changeLang(e.target.value);
});

// Langue par défaut : FR
changeLang("fr");
