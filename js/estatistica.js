function conectarEndpoint(endpoint) {
    const Protocolo = "http://"
    const URL = "localhost:3000"
    const URLCompleta = `${Protocolo}${URL}${endpoint}` 

    return URLCompleta
}

async function obterDados() {
    let tabela = document.querySelector('.dados')
    let corpoTabela
}