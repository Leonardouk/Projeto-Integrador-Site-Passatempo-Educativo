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

async function alternarPagina() {
    if (await checarStatusLogin() == true) {
        window.location.href = "tela_admin.html"
    }
}

async function validarLogin() {
    const URLCompleta = conectarEndpoint("/login")
    const login = document.getElementById("email").value
    const senha = document.getElementById("password").value
    try {
        if (login && senha) {
            const resposta = await axios.post(URLCompleta, {login: login, senha: senha})
            document.getElementById("email").value = ""
            document.getElementById("password").value = ""
            
            exibirAlerta(".alert-login", "Login Bem-Sucedido", ["show", "alert-success"], ["d-none", "alert-danger"], 2000)
            
            localStorage.setItem("token", resposta.data.token)
            alternarPagina()
        }
        else {
            exibirAlerta(".alert-login", "Preenhca todos os campos", ["show", "alert-danger"], ["d-none", "alert-success"], 2000)
        }
    }
    catch (err) {
        console.error(err.message)
        exibirAlerta(".alert-login", "Preencha um login válido", ["show", "alert-danger"], ["d-none", "alert-success"], 2000)
    }
}
