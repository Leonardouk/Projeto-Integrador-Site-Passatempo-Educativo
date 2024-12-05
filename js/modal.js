function conectarEndpoint(endpoint) {
    const Protocolo = "http://"
    const URL = "localhost:3000"
    const URLCompleta = `${Protocolo}${URL}${endpoint}` 

    return URLCompleta
}

//Define de qual ordem é o elemento svg clicado para mais tarde ser usado para gravar posição de imagem
let idImagemSelecionada = 0
function definirIDParaAlterar() {
    return new Promise((resolve) => {
        window.addEventListener('click', event => {
            const idClicado = event.target
            if (idClicado.nodeName == 'svg')
                resolve(idClicado)
            else if (idClicado.nodeName == 'path') {
                resolve(idClicado.viewportElement)
            }
            else if (idClicado.nodeName == 'IMG') {
                resolve(idClicado)
            }
        })
    })
}

async function obterImagens() {
    //Define idImagemSelecionada a partir de elemento svg clicado
    definirIDParaAlterar().then((elemento) => {
        idImagemSelecionada = elemento.id
    })
    
    //Puxa o array de elementos de texto e imagem do back, define a variável de imagens
    const URLCompleta = conectarEndpoint('/dados')
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const imagens = arrayElementos[1]

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

// //Confere se alguma imagem já foi clicada, caso seja este o caso, substitui o elemento svg por imagem
// async function selecionarImagem() {
//     if (!elementoClicado) {
//         console.log("clica em uma imagem primeiro")
//     }
//     else {
//         const imagem = document.querySelector(`#${idImagemSelecionada}`)
//         const cloneElementoClicado = elementoClicado.cloneNode(true)
        
//         cloneElementoClicado.classList.remove("border", "border-primary", "border-3", "imagemModal")
//         cloneElementoClicado.classList.add("imagemPagina")
//         cloneElementoClicado.setAttribute('id', `${idImagemSelecionada}`)
//         cloneElementoClicado.setAttribute('onclick', 'obterImagens()')
//         cloneElementoClicado.setAttribute('data-bs-toggle', 'modal')
//         cloneElementoClicado.setAttribute('data-bs-target', '#modalFotos')
//         imagem.outerHTML = cloneElementoClicado.outerHTML
        
//         let modal = bootstrap.Modal.getInstance(document.querySelector('#modalFotos'))
//         modal.hide()
//         dropImagens()
//     }
// }

//Funções para adicionar as interações de remover e adicionar conteúdo ao modal
function eventoInput() {
    const input = document.querySelector('#file')
    const formData = new FormData()
    return new Promise((resolve) => {
        input.addEventListener('change', event => {
            formData.delete('arquivo')
            if (input.files.length > 0) {
                const type = input.files[0].type
                const formats = ["image/jpeg", "image/png", "image/jpg"]
                if (!formats.includes(type)) {
                    console.log("Selecione um tipo de arquivo compatível: png, jpeg, jpg")
                }
                else {
                    formData.append('arquivo', input.files[0])
                    resolve(formData)
                }
            }
        })
    })
}

async function uploadImagem() {
    const URLCompleta = conectarEndpoint('/upload')
    formdata = await eventoInput()
    
    await axios.post(URLCompleta, formdata, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
const botaoUpload = document.querySelector('#botaoUpload')
botaoUpload.addEventListener('click', uploadImagem)

async function removerImagem() {
    let URLCompleta = conectarEndpoint('/dados')
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const arrayTodasImagens = arrayElementos[1]
    
    if (elementoClicado) {
        console.log(elementoClicado)
        arrayTodasImagens.forEach(element => {
            if (element.src == elementoClicado.getAttribute('src')) {
                id = element._id
            }
        })
        URLCompleta = conectarEndpoint('/remover')
        elementoClicado.remove()
        await axios.post(URLCompleta, {_id: id, src: elementoClicado.getAttribute('src')})
        elementoClicado = ""
    }
}

//Códigos para o botão custom de upload
const label = document.querySelector('.custom-file-button')
function onEnter() {
    label.classList.add("hover")
}
function onLeave() {
    label.classList.remove("hover")
}
label.addEventListener("mouseover", onEnter)
label.addEventListener("mouseleave", onLeave)