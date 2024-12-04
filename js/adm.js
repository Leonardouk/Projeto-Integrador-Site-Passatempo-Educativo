function sair() {
    const token = localStorage.getItem("token")
    localStorage.clear()
    window.location.href = "login.html"
}