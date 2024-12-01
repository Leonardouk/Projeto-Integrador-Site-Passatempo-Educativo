function conectarEndpoint(endpoint) {
    const Protocolo = "http://"
    const URL = "localhost:3000"
    const URLCompleta = `${Protocolo}${URL}${endpoint}` 

    return URLCompleta
}

function checarStatusLogin() {
    const URLCompleta = conectarEndpoint("/checarLogin")
    const token = localStorage.getItem("token")

    try {
        if (token) {
            const resposta = axios.post(URLCompleta, {token: token})
            
            if (resposta) {
                window.location.href = "area_admin_teste.html"
            }
        }
    }
    catch (err) {
        localStorage.clear()
        exibirAlerta(".alert-login", "Login expirado", ["show", "alert-danger"], ["d-none", "alert-success"], 2000)
    }
}

async function obterDados() {
    //Define o arrayTodosTextos e arrayTodasImagens por meio da comunicação com o DB
    const URLCompleta = conectarEndpoint('/dados')
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const arrayTodosTextos = arrayElementos[0]
    const arrayTodasImagens = arrayElementos[1]
    
    //Posiciona todos os textos ao seu lado e cria espaços para as imagens que podem os acompanhar
    arrayTodosTextos.forEach(element => { 
        if (element.pagina.hasOwnProperty("home")) {
            const texto = element.texto
            element.pagina.home.forEach(element => {
                let paragrafo = document.querySelector(`#texto${element}`)
                paragrafo.innerHTML = texto
            })
        }
    })
    arrayTodasImagens.forEach(element => {
        if (element.pagina.hasOwnProperty("home")) {
            const src = element.src
            const alt = element.alt
            
            element.pagina.home.forEach(element => {
                img = document.querySelector(`#imagem${element}`)
                img.outerHTML = `<img class="imagemPagina" src="${src}" alt="${alt}" id="imagem${element}">`
            })
            if (element.ordem != 999) {
                div = document.createElement('div')
                document.querySelector(`#linha${element.ordem}`).insertAdjacentElement("beforeend", div)
                div.outerHTML = `<div class=\"col-4\" id=ordem${element.ordem}>`

                img = document.createElement('img')
                document.querySelector(`#ordem${element.ordem}`).insertAdjacentElement('beforeend', img)
                img.outerHTML = `<img class="imagemPagina" src="${element.src}" alt="${element.alt}" id="imagem${element.ordem}">`
            }
        }
    })
}

// let modoAdmin = false
// async function trocarModoAdmin() {
//     //Define o arrayTodosTextos por meio da comunicação com o DB
//     const URLCompleta = conectarEndpoint('/teste')
//     const arrayElementos = ((await axios.get(URLCompleta)).data)
//     const arrayTodosTextos = arrayElementos[0]
//     const arrayTodasImagens = arrayElementos[1]

//     //Confore em qual estado se encontra o Modo Admin e troca para o oposto ao apertar do botão
//     modoAdmin ? modoAdmin = false : modoAdmin = true;

//     //Caso o modo admin esteja ativo, todos os elementos são buscados no array e colocados em seus respectivos espaços no arquivo html e os torna editáveis
//     if (modoAdmin == true) {
//         let botaoCadastro = document.querySelector("#botaoCadastro")
//         botaoCadastro.classList.remove("d-none") //Torna o botão de cadastro visível

//         //Transforma todos elementos de texto em editáveis e também cria as opções de escolha de imagem se uma imagem não ter sido salva anteriormente
//         arrayTodosTextos.forEach(element => {
//             if (element.pagina.includes("teste")) {
//                 let paragrafo = document.querySelector(`#texto${element.ordem}`)
//                 let texto = paragrafo.innerHTML
//                 paragrafo.outerHTML = `<textarea class=\"form-control\" name=\"test\" id=\"texto${element.ordem}\" style=\"height: 300px;\"></textarea>`
//                 paragrafo = document.querySelector(`#texto${element.ordem}`)
//                 paragrafo.innerHTML = texto
                
//                 img = document.querySelector(`#imagem${element.ordem}`)
//                 if (!img) {
//                     div = document.querySelector(`#ordem${element.ordem}`)
//                     svg = document.createElement('svg')
//                     div.insertAdjacentElement('beforeend', svg)
//                     svg.outerHTML = `<svg onclick=\"obterImagens()\" xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" fill=\"currentColor\" class=\"bi bi-camera-fill btn btn-light border-dark\" viewBox=\"0 0 16 16\" data-bs-toggle=\"modal\" data-bs-target=\"#modalFotos\" id=\"imagem${element.ordem}\"><path d=\"M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0\"/><path d=\"M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0\"/></svg>`   
//                 }
//             }
//         });
//         //Confere se há imagens que já foram posicionadas e as transforma em editáveis
//         arrayTodasImagens.forEach(element => {
//             if (element.ordem != 999) {
//                 img = document.querySelector(`#imagem${element.ordem}`)
//                 img.classList.add("btn", "btn-link")
//                 img.setAttribute("onclick", "obterImagens()")
//                 img.setAttribute("data-bs-toggle", "modal")
//                 img.setAttribute("data-bs-target", "#modalFotos")
//             }
//         })
//     }
//     //Caso o modo admin seja desativado, todos os elementos são buscados no array e colocados em seus respectivos espaços no arquivo html, salvando seu conteúdo no DB
//     else {
//         let botaoCadastro = document.querySelector("#botaoCadastro")
//         botaoCadastro.classList.add("d-none") ////Torna o botão de cadastro invisível

//         arrayTodosTextos.forEach(element => {
//             if (element.pagina.includes("teste")) {
//                 let paragrafo = document.querySelector(`#texto${element.ordem}`)
//                 let texto = paragrafo.value
//                 paragrafo.outerHTML = `<p style=\"text-indent: 1em;\" id=\"texto${element.ordem}\"></p>`
//                 paragrafo = document.querySelector(`#texto${element.ordem}`)
//                 paragrafo.innerHTML = texto

//                 img = document.querySelector(`#imagem${element.ordem}`)
//                 if (img.nodeName == 'svg') {
//                     img.remove()
//                 }
//             }
//         });
//         arrayTodasImagens.forEach(element => {
//             if (element.ordem != 999) {
//                 img = document.querySelector(`#imagem${element.ordem}`)
//                 img.classList.remove("btn", "btn-link")
//                 img.removeAttribute("onclick")
//                 img.removeAttribute("data-bs-toggle")
//                 img.removeAttribute("data-bs-target")
//             }
//         })
//     }
// }

// //Tem função de enviar todas as mudanças feitas em relação a imagens e textos na página para o backend
// //com o objetivo que sejam gravadas
// async function salvarMudancas() {
//     const URLCompleta = conectarEndpoint('/teste')
//     const arrayElementos = ((await axios.get(URLCompleta)).data)
//     const arrayTodosTextos = arrayElementos[0]
//     const arrayTodasImagens = arrayElementos[1]
//     const arrayImagensParaSalvar = []
//     let stringVazia = false

//     arrayTodosTextos.forEach(element => {
//         let imagem = document.querySelector(`#imagem${element.ordem}`)
//         let id = ""
//         let paragrafo = document.querySelector(`#texto${element.ordem}`)
//         let texto = paragrafo.value
//         element.texto = paragrafo.value

//         if (!texto) {
//             stringVazia = true
//         }
        
//         arrayTodasImagens.forEach(element => {
//             if (element.pagina.includes("teste") && element.src == imagem.getAttribute('src')) {
//                 id = element._id
//             }
//         })
        
//         if (imagem.nodeName == 'IMG') {
//             arrayImagensParaSalvar.push({_id: id, ordem: element.ordem})
//         }
//     });

//     if (!stringVazia) {
//         let botaoCadastro = document.querySelector("#botaoCadastro")
//         botaoCadastro.outerHTML = "<button class=\"btn btn-success w-100 \" id=\"botaoCadastro\" onclick=\"salvarMudancas()\" disabled=\"\"><div class=\"spinner-border spinner-border-sm text-light\"></div></button>"

//         await axios.post(URLCompleta, [arrayTodosTextos, arrayImagensParaSalvar]).data
        
//         setTimeout(() => {
//             botaoCadastro = document.querySelector("#botaoCadastro")
//             botaoCadastro.outerHTML = "<button class=\"btn btn-outline-success w-100 \" id=\"botaoCadastro\" onclick=\"salvarMudancas()\">Salvar Mudanças</button>"
//         }, 2000)
//     }
//     else {
//         console.log("Nenhum texto pode estar em branco")
//     }
// }

// //Todos os códigos a partir de aqui são voltados a configurar a seleção de imagens que ocorre durante a edição da página 

// //Define de qual ordem é o elemento svg clicado para mais tarde ser usado para gravar posição de imagem
// let idImagemSelecionada = 0
// function definirIDParaAlterar() {
//     return new Promise((resolve) => {
//         window.addEventListener('click', event => {
//             const idClicado = event.target
//             if (idClicado.nodeName == 'svg')
//                 resolve(idClicado)
//             else if (idClicado.nodeName == 'path') {
//                 resolve(idClicado.viewportElement)
//             }
//             else if (idClicado.nodeName == 'IMG') {
//                 resolve(idClicado)
//             }
//         })
//     })
// }

// async function obterImagens() {
//     //Define idImagemSelecionada a partir de elemento svg clicado
//     definirIDParaAlterar().then((elemento) => {
//         idImagemSelecionada = elemento.id
//     })
    
//     //Puxa o array de elementos de texto e imagem do back, define a variável de imagens
//     const URLCompleta = conectarEndpoint('/teste')
//     const arrayElementos = ((await axios.get(URLCompleta)).data)
//     const imagens = arrayElementos[1]

//     //Busca o elemento de modal-body, cria uma row e a insere dentro dele.
//     const modalBody = document.querySelector('#corpoModalFotos')
//     divRow = document.createElement('div')
//     modalBody.insertAdjacentElement("beforeend", divRow)
//     divRow.outerHTML = "<div class=\"row\"></div>"
    
//     //Para cada elemento de imagem, cria e insere uma coluna com o elemento,
//     //já preenchendo todos os atributos necessários.
//     await imagens.forEach(element => {
//         divCol = document.createElement('div')
//         document.querySelector(`.row`).insertAdjacentElement("beforeend", divCol)
//         divCol.outerHTML = `<div class=\"col-3 mx-4 my-2\"><img class=\"imagemModal btn btn-link\" src=\"${element.src}\" alt=\"${element.alt}\" onclick=\"escolherImagem()\"></div>`
//     });
// }

// //Esvazia o modal-body removendo todos os nós.
// function dropImagens() {
//     const modalBody = document.querySelector('#corpoModalFotos')
//     setTimeout(() => {
//         modalBody.innerHTML = ""
//         elementoClicado = ""
//     }, 500)
// }

// //Identifica qual das imagens está sendo clicada, coloca uma borda ao seu redor e usa
// //Promise e Resolve para devolver o valor dessa imagem
// function definirImagem() {
//     return new Promise((resolve) => {
//         window.addEventListener('click', event => {
//             const elementoClicado = event.target
//             if (elementoClicado.classList.contains("imagemModal")) {
//                 elementoClicado.classList.add("border", "border-primary", "border-3")
//                 resolve(elementoClicado)
//             }
//         })
//     })
// }
// //Confere se alguma imagem já foi clicada usando a função definirImagem() e atribui o
// //valor da imagem à variável elementoClicado
// let elementoClicado = ""
// async function escolherImagem() {
//     if (!elementoClicado) {
//         await definirImagem().then((elemento) => {
//             elementoClicado = elemento
//         })
//     }
//     else {
//         elementoClicado.classList.remove("border", "border-primary", "border-3")
//         await definirImagem().then((elemento) => {
//             elementoClicado = elemento
//         })
//     }
// }

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

// //Funções para adicionar as interações de remover e adicionar conteúdo ao modal
// function eventoInput() {
//     const input = document.querySelector('#file')
//     const formData = new FormData()
//     return new Promise((resolve) => {
//         input.addEventListener('change', event => {
//             formData.delete('arquivo')
//             if (input.files.length > 0) {
//                 const type = input.files[0].type
//                 const formats = ["image/jpeg", "image/png", "image/jpg"]
//                 if (!formats.includes(type)) {
//                     console.log("Selecione um tipo de arquivo compatível: png, jpeg, jpg")
//                 }
//                 else {
//                     formData.append('arquivo', input.files[0])
//                     resolve(formData)
//                 }
//             }
//         })
//     })
// }

// async function uploadImagem() {
//     const URLCompleta = conectarEndpoint('/upload')
//     formdata = await eventoInput()
    
//     await axios.post(URLCompleta, formdata, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     })
// }
// const botaoUpload = document.querySelector('#botaoUpload')
// botaoUpload.addEventListener('click', uploadImagem)

// async function removerImagem() {
//     let URLCompleta = conectarEndpoint('/teste')
//     const arrayElementos = ((await axios.get(URLCompleta)).data)
//     const arrayTodasImagens = arrayElementos[1]
    
//     if (elementoClicado) {
//         console.log(elementoClicado)
//         arrayTodasImagens.forEach(element => {
//             if (element.src == elementoClicado.getAttribute('src')) {
//                 id = element._id
//             }
//         })
//         URLCompleta = conectarEndpoint('/remover')
//         elementoClicado.remove()
//         await axios.post(URLCompleta, {_id: id, src: elementoClicado.getAttribute('src')})
//         elementoClicado = ""
//     }
// }

// //Códigos para o botão custom de upload
// const label = document.querySelector('.custom-file-button')
// function onEnter() {
//     label.classList.add("hover")
// }
// function onLeave() {
//     label.classList.remove("hover")
// }
// label.addEventListener("mouseover", onEnter)
// label.addEventListener("mouseleave", onLeave)