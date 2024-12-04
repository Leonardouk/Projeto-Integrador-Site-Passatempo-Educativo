function conectarEndpoint(endpoint) {
    const Protocolo = "http://"
    const URL = "localhost:3000"
    const URLCompleta = `${Protocolo}${URL}${endpoint}` 

    return URLCompleta
}

function sair() {
    const token = localStorage.getItem("token")
    localStorage.clear()
    window.location.href = "login.html"
}

function obterDados() {
    const URLCompleta = conectarEndpoint('/log-sessao')
    let tabela = document.querySelector('.dados')
    let corpoTabela = document.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""

    for (let dado of dados) {
        let linha = corpoTabela.insertRow(0)
        let celulaID = linha.insertCell(0)
        let celulaIP = linha.insertCell(1)
        let celulaEntrada = linha.insertCell(2)
        let celulaSaida = linha.insertCell(3)
        let celulaDuracao = linha.insertCell(4)

        celulaID.innerHTML = dado.sessionId
        celulaIP.innerHTML = dado.ipAddress
        celulaEntrada.innerHTML = dado.startTime
        celulaSaida.innerHTML = dado.endTime
        celulaDuracao = dado.sessionDuration
    }
}