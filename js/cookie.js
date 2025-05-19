// Função para aceitar cookies
function acceptCookies() {
    document.getElementById("cookiePopup").style.display = "none";
    sessionStorage.setItem("cookiesAccepted", "true");
}

// Função para recusar cookies
function declineCookies() {
    document.getElementById("cookiePopup").style.display = "none";
    sessionStorage.setItem("cookiesAccepted", "false");
}

// Verificação de preferência armazenada
function checarEscolhaCookies() {
    if (sessionStorage.getItem("cookiesAccepted") === "true" || sessionStorage.getItem("cookiesAccepted") === "false") {
        document.getElementById("cookiePopup").style.display = "none";
    }
}
