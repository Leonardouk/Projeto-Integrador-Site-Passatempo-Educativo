const protocolo = 'http://'
const baseURL = 'localhost:3000'
const testeEndpoint = '/teste'
let modoAdmin = false

async function obterTexto() {
    //Define o arrayTodosTextos e arrayTodasImagens por meio da comunicação com o DB
    const URLCompleta = `${protocolo}${baseURL}${testeEndpoint}`
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const arrayTodosTextos = arrayElementos[0]
    const arrayTodasImagens = arrayElementos[1]

    arrayTodosTextos.forEach(element => { 
        if (element.pagina == "teste") {
            let paragrafo = document.querySelector(`#texto${element.ordem}`)
            paragrafo.innerHTML = element.texto
        }
    })
    arrayTodasImagens.forEach(element => {
        if (element.pagina == "teste") {
            if (element.linkImagem) {
                div = document.createElement('div')
                document.querySelector(`#linha${element.ordem}`).insertAdjacentElement("beforeend", div)
                div.outerHTML = `<div class=\"col-4\" id=ordem${element.ordem}>`

                img = document.createElement('img')
                document.querySelector(`#ordem${element.ordem}`).insertAdjacentElement('beforeend', img)
                img.outerHTML = `<img src=\"https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp\">`
            }
        }
    })
}

async function trocarModoAdmin() {
    //Define o arrayTodosTextos por meio da comunicação com o DB
    const URLCompleta = `${protocolo}${baseURL}${testeEndpoint}`
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const arrayTodosTextos = arrayElementos[0]

    //Confore em qual estado se encontra o Modo Admin e troca para o oposto ao apertar do botão
    modoAdmin ? modoAdmin = false : modoAdmin = true;
    console.log(`o modo admin está ligado: ${modoAdmin}`)

    //Caso o modo admin esteja ativo, todos os elementos são buscados no array e colocados em seus respectivos espaços no arquivo html e os torna editáveis
    if (modoAdmin == true) {
        let botaoCadastro = document.querySelector("#botaoCadastro")
        botaoCadastro.classList.remove("d-none") //Torna o botão de cadastro visível

        arrayTodosTextos.forEach(element => {
            if (element.pagina == "teste") {
                let paragrafo = document.querySelector(`#texto${element.ordem}`)
                let texto = paragrafo.innerHTML
                paragrafo.outerHTML = `<textarea class=\"form-control\" name=\"test\" id=\"texto${element.ordem}\" style=\"height: 300px;\"></textarea>`
                paragrafo = document.querySelector(`#texto${element.ordem}`)
                paragrafo.innerHTML = texto
            }
        });
    }
    //Caso o modo admin seja desativado, todos os elementos são buscados no array e colocados em seus respectivos espaços no arquivo html, salvando seu conteúdo no DB
    else {
        let botaoCadastro = document.querySelector("#botaoCadastro")
        botaoCadastro.classList.add("d-none") ////Torna o botão de cadastro invisível

        arrayTodosTextos.forEach(element => {
            if (element.pagina == "teste") {
                let paragrafo = document.querySelector(`#texto${element.ordem}`)
                let texto = paragrafo.value
                paragrafo.outerHTML = `<p style=\"text-indent: 1em;\" id=\"texto${element.ordem}\"></p>`
                paragrafo = document.querySelector(`#texto${element.ordem}`)
                paragrafo.innerHTML = texto
            }
        });
    }
}

async function cadastrarTextos() {
    const URLCompleta = `${protocolo}${baseURL}${testeEndpoint}`
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const arrayTodosTextos = arrayElementos[0]
    let stringVazia = false

    arrayTodosTextos.forEach(element => {
        let paragrafo = document.querySelector(`#texto${element.ordem}`)
        let texto = paragrafo.value
        element.texto = paragrafo.value

        if (!texto) {
            stringVazia = true
        }
    });

    if (!stringVazia) {
        let botaoCadastro = document.querySelector("#botaoCadastro")
        botaoCadastro.outerHTML = "<button class=\"btn btn-success w-100 \" id=\"botaoCadastro\" onclick=\"cadastrarTextos()\" disabled=\"\"><div class=\"spinner-border spinner-border-sm text-light\"></div></button>"

        await axios.post(URLCompleta, arrayTodosTextos).data
        
        setTimeout(() => {
            botaoCadastro = document.querySelector("#botaoCadastro")
            botaoCadastro.outerHTML = "<button class=\"btn btn-outline-success w-100 \" id=\"botaoCadastro\" onclick=\"cadastrarTextos()\">Salvar Mudanças</button>"
        }, 2000)
    }
    else {
        console.log("Nenhum texto pode estar em branco")
    }
}