const protocolo = 'http://'
const baseURL = 'localhost:3000'
const testeEndpoint = '/teste'
let modoAdmin = false

async function obterTexto() {
    //Define o arrayTodosTextos e arrayTodasImagens por meio da comunicação com o DB
    const URLCompleta = `${protocolo}${baseURL}${testeEndpoint}`
    const arrayElementos = ((await axios.get(URLCompleta)).data)
    const arrayTodosTextos = arrayElementos[0]
    // const arrayTodasImagens = arrayElementos[1]
    arrayTodosTextos.forEach(element => { 
        if (element.pagina == "teste") {
            let paragrafo = document.querySelector(`#texto${element.ordem}`)
            paragrafo.innerHTML = element.texto
        }
    })
    // arrayTodasImagens.forEach(element => {
    //     if (element.pagina == "teste") {
    //         let imagem = document.querySelector(`#img${element.ordem}`)
    //         imagem.src = element.linkImagem
    //     }
    // })
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
        botaoCadastro.classList.remove("d-none")

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
        botaoCadastro.classList.add("d-none")

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

        if (!texto) {
            stringVazia = true
        }
    });

    if (!stringVazia) {
        const array = (await axios.post(URLCompleta, {texto: "arrayTodosTextos"}).data)
    }
    else {
        console.log("Nenhum texto pode estar em branco")
    }
}