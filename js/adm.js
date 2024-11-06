function conectarEndpoint(endpoint) {
    const Protocolo = "http://"
    const URL = "localhost:3000"
    const URLCompleta = `${Protocolo}${URL}${endpoint}` 

    return URLCompleta
}

async function checarStatusLogin() {
    try {
        const URLCompleta= conectarEndpoint("/login")
        const token = (await axios.get(URLCompleta)).data
        console.log(token)
    }
    catch {
        return 0
    }
}

async function validarLogin() {
    const URLCompleta = conectarEndpoint("/login")
    const login = document.getElementById("login").value
    const senha = document.getElementById("senha_login").value
    try {
        const resposta = await axios.post(URLCompleta, {login: login, senha: senha})
        document.getElementById("login").value = ""
        document.getElementById("senha_login").value = ""
        
        console.log("Login Bem-Sucedido:", resposta.data)
    }
    catch {
        const alert = document.querySelector(".alert-login")
        alert.classList.remove("d-none")
        alert.classList.add("show")
        setTimeout(() => {
            alert.classList.add('d-none')
            alert.classList.remove('show')
        }, 2000)
    }
}