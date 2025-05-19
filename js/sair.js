function sair() {
    const token = localStorage.getItem("token")
    localStorage.clear()
    if (window.location.pathname.split('/').pop() === "tela_admin.html") {
        window.location.href = "login.html"
    }
    else {
        window.location.reload()
    }
}