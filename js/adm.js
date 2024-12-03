function sair() {
    const token = localStorage.getItem("token")
    localStorage.clear()
    console.log(token)
}