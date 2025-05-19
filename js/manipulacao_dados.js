function conectarEndpoint(endpoint) {
    const Protocolo = "http://"
    const URL = "localhost:3000"
    const URLCompleta = `${Protocolo}${URL}${endpoint}` 

    return URLCompleta
}

async function ativarVisaoAdmin() {
    const tokenExiste = await checarStatusLogin()
    try {
        if (tokenExiste) {
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
                if (element.pagina.hasOwnProperty(varPagina)) {
                    element.pagina[varPagina].forEach(ordem => {
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
                if (element.pagina.hasOwnProperty(varPagina)) {
                    element.pagina[varPagina].forEach(ordem => {
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
    catch (err) {
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
        if (element.pagina.hasOwnProperty(varPagina)) {
            element.pagina[varPagina].forEach(ordem => {
                let paragrafo = document.querySelector(`#texto${ordem}`)
                paragrafo.innerHTML = texto
            })
        }
    })
    arrayTodasImagens.forEach(element => {
        const src = element.src
        const alt = element.alt
        
        if (element.pagina.hasOwnProperty(varPagina)) {
            if (varPagina == 'eventos'){
                element.pagina[varPagina].forEach(ordem => {
                    const img = document.querySelector(`#imagem${ordem}`)
                    img.outerHTML = `<img class="imagemPagina card-img" src="${src}" alt="${alt}" id="imagem${ordem}">`
                })
            }
            else {
                element.pagina[varPagina].forEach(ordem => {
                const img = document.querySelector(`#imagem${ordem}`)
                img.outerHTML = `<img class="imagemPagina img_card" src="${src}" alt="${alt}" id="imagem${ordem}">`
                })
            }
        }
    })
    ativarVisaoAdmin()
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
    try {
        arrayTodosTextos.forEach(element => {
            let paragrafo = ""
            if (element.pagina.hasOwnProperty(varPagina)) {
                element.pagina[varPagina].forEach(ordem => {
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
            let id = ""
            let imagem = ""
            let ordemImagem = []
            
            if (element.pagina.hasOwnProperty(varPagina)) {
                element.pagina[varPagina].forEach(ordem => {
                    imagem = document.querySelector(`#imagem${ordem}`)
                    ordemImagem.push(ordem)
                })
            }
            if (element.pagina.hasOwnProperty(varPagina) && element.src == imagem.getAttribute('src')) {
                id = element._id
            }
            if (imagem.nodeName == 'IMG') {
                arrayImagensParaSalvar.push({_id: id, ordem: ordemImagem, pagina: varPagina})
            }
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
    catch (err) {
        console.error(err.message)
    }
}