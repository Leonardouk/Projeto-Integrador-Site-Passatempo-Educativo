function conectarEndpoint(endpoint) {
    const Protocolo = "http://"
    const URL = "localhost:3000"
    const URLCompleta = `${Protocolo}${URL}${endpoint}` 

    return URLCompleta
}

function sair() {
    const token = localStorage.getItem("token")
    localStorage.clear()
    window.location.reload()
}

function alternarNavbar() {
    //Alterna navbar parão para a navbar de administrador
    const barraNavegacao = document.querySelector('.barra_navegacao')
    const li = document.createElement('li')
    barraNavegacao.insertAdjacentElement('beforeend', li)
    li.outerHTML = "<li class=\"nav-item dropdown\"><a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\" aria-label=\"Toggle perfil\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"25\" height=\"25\" fill=\"currentColor\" class=\"bi bi-person-fill\" viewBox=\"0 0 16 16\"><path d=\"M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6\"/></svg></a><ul class=\"dropdown-menu dropdown-menu-lg-end \" aria-labelledby=\"navbarDropdown\"><li><a class=\"dropdown-item\"><div class=\"sair\" onclick=\"sair()\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" fill=\"currentColor\" class=\"bi bi-box-arrow-right m-3\" viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z\"/><path fill-rule=\"evenodd\" d=\"M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z\"/></svg>Sair</div></a></li></ul></li>"
}

async function checarStatusLogin() {
    const URLCompleta = conectarEndpoint("/checarLogin")
    const token = localStorage.getItem("token")
    try {
        if (token) {
            const resposta = axios.post(URLCompleta, {token: token})
            if (resposta) {
                //Função responsável por alternar navbar para a sua versão de administrador
                alternarNavbar()

                //Define o arrayTodosTextos por meio da comunicação com o DB
                const URLCompleta = conectarEndpoint('/dados')
                const arrayElementos = ((await axios.get(URLCompleta)).data)
                const arrayTodosTextos = arrayElementos[0]
                const arrayTodasImagens = arrayElementos[1]
    
                //Todos os elementos são buscados no array e colocados em seus respectivos espaços no arquivo html e os torna editáveis
                let botaoCadastro = document.querySelector("#botaoCadastro")
                botaoCadastro.classList.remove("d-none") //Torna o botão de cadastro visível
        
                //Transforma todos elementos de texto em editáveis e também cria as opções de escolha de imagem se uma imagem não ter sido salva anteriormente
                arrayTodosTextos.forEach(element => {
                    const texto = element.texto
                    if (element.pagina.hasOwnProperty("home")) {
                        element.pagina.home.forEach(ordem => {
                            let paragrafo = document.querySelector(`#texto${ordem}`)
                            paragrafo.outerHTML = `<textarea class=\"form-control\" name=\"test\" id=\"texto${ordem}\" style=\"height: 300px;\"></textarea>`
                            paragrafo = document.querySelector(`#texto${ordem}`)
                            paragrafo.innerHTML = texto
                        })
                    }
                });
                //Confere se há imagens que já foram posicionadas e as transforma em editáveis
                arrayTodasImagens.forEach(element => {
                    const src = element.src
                    const alt = element.alt
                    if (element.pagina.hasOwnProperty("home")) {
                        element.pagina.home.forEach(ordem => {
                            img = document.querySelector(`#imagem${ordem}`)
                            if (!src) {
                                div = document.createElement("div")
                                img.replaceWith(div)
                                svg = document.createElement('svg')
                                div.insertAdjacentElement('beforeend', svg)
                                svg.outerHTML = `<svg onclick=\"obterImagens()\" xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" fill=\"currentColor\" class=\"bi bi-camera-fill btn btn-light border-dark\" viewBox=\"0 0 16 16\" data-bs-toggle=\"modal\" data-bs-target=\"#modalFotos\" id=\"imagem${ordem}\"><path d=\"M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0\"/><path d=\"M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0\"/></svg>`   
                            }
                            else {
                                img.classList.add("btn", "btn-link")
                                img.setAttribute("onclick", "obterImagens()")
                                img.setAttribute("data-bs-toggle", "modal")
                                img.setAttribute("data-bs-target", "#modalFotos")
                            }
                        })
                    }
                })
            }
        }
    }
    catch (err) {
        localStorage.clear()
        console.error(err.message)
        // exibirAlerta(".alert-login", "Login expirado", ["show", "alert-danger"], ["d-none", "alert-success"], 2000)
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
        const texto = element.texto
        if (element.pagina.hasOwnProperty("home")) {
            element.pagina.home.forEach(ordem => {
                let paragrafo = document.querySelector(`#texto${ordem}`)
                paragrafo.innerHTML = texto
            })
        }
    })
    arrayTodasImagens.forEach(element => {
        const src = element.src
        const alt = element.alt
        
        if (element.pagina.hasOwnProperty("home")) {
            element.pagina.home.forEach(ordem => {
                const img = document.querySelector(`#imagem${ordem}`)
                img.outerHTML = `<img class="imagemPagina d-block w-100 img_carrossel" src="${src}" alt="${alt}" id="imagem${ordem}">`
            })
        }
    })
    checarStatusLogin()
}

//Tem função de enviar todas as mudanças feitas em relação a imagens e textos na página para o backend
//com o objetivo que sejam gravadas
async function salvarMudancas() {
    const URLCompleta = conectarEndpoint('/dados')
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const arrayTodosTextos = arrayElementos[0]
    const arrayTodasImagens = arrayElementos[1]
    const arrayImagensParaSalvar = []
    let stringVazia = false

    arrayTodosTextos.forEach(element => {
        let paragrafo = ""
        if (element.pagina.hasOwnProperty("home")) {
            element.pagina.home.forEach(ordem => {
                paragrafo = document.querySelector(`#texto${ordem}`)
            })
            let texto = paragrafo.value
            element.texto = paragrafo.value
            
            if (!texto) {
                stringVazia = true
            }
        }
    })

    arrayTodasImagens.forEach(element => {
        let id = 0
        let imagem = ""
        let ordemImagem = []
        
        if (element.pagina.hasOwnProperty("home")) {
            element.pagina.home.forEach(ordem => {
                imagem = document.querySelector(`#imagem${ordem}`)
                ordemImagem.push(ordem)
            })
        }
        if (ordemImagem.length > 0) {
            imagem = document.querySelector(`#imagem${ordemImagem[0]}`)
        }
        
        // if (imagem) {
        //     if (element.src == imagem.getAttribute('src')) {
        //         id = Number(element._id)
        //     }
            
        //     if (imagem.nodeName == 'IMG') {
        //         arrayImagensParaSalvar.push({_id: id, ordem: ordemImagem, pagina: "home"})
        //     }
        // }
    })

    if (!stringVazia) {
        let botaoCadastro = document.querySelector("#botaoCadastro")
        botaoCadastro.outerHTML = "<button class=\"btn btn-success w-100 \" id=\"botaoCadastro\" onclick=\"salvarMudancas()\" disabled=\"\"><div class=\"spinner-border spinner-border-sm text-light\"></div></button>"

        await axios.post(URLCompleta, [arrayTodosTextos, arrayImagensParaSalvar]).data
        
        setTimeout(() => {
            botaoCadastro = document.querySelector("#botaoCadastro")
            botaoCadastro.outerHTML = "<button class=\"btn btn-outline-success w-100 \" id=\"botaoCadastro\" onclick=\"salvarMudancas()\">Salvar Mudanças</button>"
        }, 2000)
    }
    else {
        console.log("Nenhum texto pode estar em branco")
    }
}

//Confere se alguma imagem já foi clicada, caso seja este o caso, substitui o elemento svg por imagem
async function selecionarImagem() {
    if (!elementoClicado) {
        console.log("clica em uma imagem primeiro")
    }
    else {
        const imagem = document.querySelector(`#${idImagemSelecionada}`)
        const cloneElementoClicado = elementoClicado.cloneNode(true)
        
        cloneElementoClicado.classList.remove("border", "border-primary", "border-3", "imagemModal")
        cloneElementoClicado.classList.add("imagemPagina", "d-block", "w-100", "img_carrossel")
        cloneElementoClicado.setAttribute('id', `${idImagemSelecionada}`)
        cloneElementoClicado.setAttribute('onclick', 'obterImagens()')
        cloneElementoClicado.setAttribute('data-bs-toggle', 'modal')
        cloneElementoClicado.setAttribute('data-bs-target', '#modalFotos')
        imagem.outerHTML = cloneElementoClicado.outerHTML
        
        let modal = bootstrap.Modal.getInstance(document.querySelector('#modalFotos'))
        modal.hide()
        dropImagens()
    }
}