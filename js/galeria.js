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

async function obterDados() {
    //Define o arrayTodosTextos e arrayTodasImagens por meio da comunicação com o DB
    const URLCompleta = conectarEndpoint('/dados')
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const arrayTodosTextos = arrayElementos[0]
    const arrayTodasImagens = arrayElementos[1]
    
    //Posiciona todos os textos ao seu lado e cria espaços para as imagens que podem os acompanhar
    arrayTodosTextos.forEach(element => { 
        const texto = element.texto
        element.pagina.galeria.forEach(ordem => {
            let paragrafo = document.querySelector(`#texto${ordem}`)
            paragrafo.innerHTML = texto
        })
    })
    arrayTodasImagens.forEach(element => {
        const src = element.src
        const alt = element.alt
        
        element.pagina.galeria.forEach(ordem => {
            const img = document.querySelector(`#imagem${ordem}`)
            img.outerHTML = `<img class="d-block w-100 imagemPagina" src="${src}" alt="${alt}" id="imagem${ordem}">`
        })
    })
}