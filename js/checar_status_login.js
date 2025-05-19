const Protocolo = "http://"
const url = "localhost:3000"
const endpoint = "/checarLogin"
const URLCompleta = `${Protocolo}${url}${endpoint}` 
console.log("TOKEN NO LOCALSTORAGE:", localStorage.getItem("token"));
async function checarStatusLogin() {
    console.log("FUNÇÂO checarStatusLogin()")
    const token = localStorage.getItem("token")
        try {
            if (token) {
            const resposta = await axios.post(URLCompleta, {token: token})
            console.log("A resposta recebida é: " + resposta.data.login)
            return resposta.data.login
        }
    }
    catch (err) {
        console.error(`Houve um erro ao tentar checar o login: ${err}`)
        localStorage.clear()
        return false
    }
    return false
}