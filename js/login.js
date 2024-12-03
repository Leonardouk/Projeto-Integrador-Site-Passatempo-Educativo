function conectarEndpoint(endpoint) {
    const Protocolo = "http://"
    const URL = "localhost:3000"
    const URLCompleta = `${Protocolo}${URL}${endpoint}` 

    return URLCompleta
}

function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
    alert.classList.remove('show')
    alert.classList.add('d-none')
    }, timeout)
}

function checarStatusLogin() {
    const URLCompleta = conectarEndpoint("/checarLogin")
    const token = localStorage.getItem("token")

    try {
        if (token) {
            const resposta = axios.post(URLCompleta, {token: token})
            
            if (resposta) {
                window.location.href = "tela_admin.html"
            }
        }
    }
    catch (err) {
        localStorage.clear()
        exibirAlerta(".alert-login", "Login expirado", ["show", "alert-danger"], ["d-none", "alert-success"], 2000)
    }
}

async function validarLogin() {
    const URLCompleta = conectarEndpoint("/login")
    const login = document.getElementById("login").value
    const senha = document.getElementById("senha_login").value
    try {
        if (login && senha) {
            const resposta = await axios.post(URLCompleta, {login: login, senha: senha})
            document.getElementById("login").value = ""
            document.getElementById("senha_login").value = ""
            
            exibirAlerta(".alert-login", "Login Bem-Sucedido", ["show", "alert-success"], ["d-none", "alert-danger"], 2000)
            
            localStorage.setItem("token", resposta.data.token)
            checarStatusLogin()
        }
        else {
            exibirAlerta(".alert-login", "Preenhca todos os campos", ["show", "alert-danger"], ["d-none", "alert-success"], 2000)
        }
    }
    catch {
        exibirAlerta(".alert-login", "Preencha um login válido", ["show", "alert-danger"], ["d-none", "alert-success"], 2000)
    }
}