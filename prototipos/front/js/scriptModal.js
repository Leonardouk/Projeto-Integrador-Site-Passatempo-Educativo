const protocolo = 'http://'
const baseURL = 'localhost:3000'
const testeEndpoint = '/teste'

async function obterImagens() {
    //Puxa o array de elementos de texto e imagem do back, define a variável de imagens e um contador
    const URLCompleta = `${protocolo}${baseURL}${testeEndpoint}`
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const imagens = arrayElementos[1]
    let contador = 0

    //Busca o elemento de modal-body, cria uma row e a insere dentro dele.
    const modalBody = document.querySelector('#corpoModalFotos')
    divRow = document.createElement('div')
    modalBody.insertAdjacentElement("beforeend", divRow)
    divRow.outerHTML = "<div class=\"row\"></div>"
    
    //Para cada elemento de imagem, cria e insere uma coluna com o elemento,
    //já preenchendo todos os atributos necessários.
    await imagens.forEach(element => {
        divCol = document.createElement('div')
        document.querySelector(`.row`).insertAdjacentElement("beforeend", divCol)
        divCol.outerHTML = `<div class=\"col-3 mx-4 my-2\"><img class=\"imagemModal btn btn-link\" src=\"${element.src}\" alt=\"${element.alt}\" onclick=\"escolherImagem()\"></div>`
    });
}

//Esvazia o modal-body removendo todos os nós.
function dropImagens() {
    const modalBody = document.querySelector('#corpoModalFotos')
    setTimeout(() => {
        modalBody.innerHTML = ""
        elementoClicado = ""
    }, 500)
}

//Identifica qual das imagens está sendo clicada, coloca uma borda ao seu redor e usa
//Promise e Resolve para devolver o valor dessa imagem
function definirImagem() {
    return new Promise((resolve) => {
        window.addEventListener('click', event => {
            const elementoClicado = event.target
            if (elementoClicado.classList.contains("imagemModal")) {
                elementoClicado.classList.add("border", "border-primary", "border-3")
                resolve(elementoClicado)
            }
        })
    })
}
//Confere se alguma imagem já foi clicada usando a função definirImagem() e atribui o
//valor da imagem à variável elementoClicado
let elementoClicado = ""
async function escolherImagem() {
    if (!elementoClicado) {
        await definirImagem().then((elemento) => {
            elementoClicado = elemento
        })
    }
    else {
        elementoClicado.classList.remove("border", "border-primary", "border-3")
        await definirImagem().then((elemento) => {
            elementoClicado = elemento
        })
    }
}

async function selecionarImagem() {
    if (!elementoClicado) {
        console.log("clica em uma imagem primeiro")
    }
    else {
        imagem = document.querySelector('#imagem0')

        const cloneElementoClicado = elementoClicado.cloneNode(true)
        cloneElementoClicado.classList.remove("border", "border-primary", "border-3", "imagemModal")
        cloneElementoClicado.setAttribute('id', 'imagem0')
        cloneElementoClicado.setAttribute('onclick', 'obterImagens()')
        cloneElementoClicado.setAttribute('data-bs-toggle', 'modal')
        cloneElementoClicado.setAttribute('data-bs-target', '#modalFotos')
        imagem.outerHTML = cloneElementoClicado.outerHTML
    }
}
//Falta tornar a imagem selecionada definitva e fazer com que ao selecionar o modal feche