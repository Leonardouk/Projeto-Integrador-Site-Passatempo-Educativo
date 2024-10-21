const protocolo = 'http://'
const baseURL = 'localhost:3000'
const testeEndpoint = '/teste'

async function obterTexto() {
    //Define o arrayTodosTextos por meio da comunicação com o DB
    const URLCompleta = `${protocolo}${baseURL}${testeEndpoint}`
    const arrayTodosTextos = ((await axios.get(URLCompleta)).data)
    
    arrayTodosTextos.forEach(element => {
        if (element.pagina == "teste") {
            // console.log('foi')
            // arrayTextosPagina.push({texto: element.texto, ordem: element.ordem})
            let paragrafo = document.querySelector(`#texto${element.ordem}`)
            paragrafo.innerHTML = element.texto
        }
    })
}

let modoAdmin = false
async function trocarModoAdmin() {
    //Define o arrayTodosTextos por meio da comunicação com o DB
    const URLCompleta = `${protocolo}${baseURL}${testeEndpoint}`
    const arrayTodosTextos = ((await axios.get(URLCompleta)).data)

    //Confore em qual estado se encontra o Modo Admin e troca para o oposto ao apertar do botão
    modoAdmin ? modoAdmin = false : modoAdmin = true;
    console.log(`o modo admin está ligado: ${modoAdmin}`)

    if (modoAdmin == true) {
        arrayTodosTextos.forEach(element => {
            if (element.pagina == "teste") {
                let paragrafo = (document.querySelector(`#texto${element.ordem}`)).value
                console.log(paragrafo)
                let texto = paragrafo.innerHTML
                paragrafo.outerHTML = "<textarea class=\"form-control\" name=\"test\" id=\"textoComum\" style=\"height: 300px;\"></textarea>"
                paragrafo = document.querySelector(`#texto${element.ordem}`)
                paragrafo.innerHTML = texto
            }
        });
        //Lê o elemento pelo id e o seu valor interno, muda o elemento de <p> para <textarea> e preserva o valor interno
        //Na próxima versão do arquivo, ao invés de preservar o valor apenas na variável, ele precisará encontrar o valor no DB
        // let paragrafo = document.getElementById('textoComum')
        // let texto = paragrafo.innerHTML
        // paragrafo.outerHTML = "<textarea class=\"form-control\" name=\"test\" id=\"textoComum\" style=\"height: 300px;\"></textarea>"
        // paragrafo = document.querySelector('#textoComum')
        // paragrafo.innerHTML = texto
    }
    else {
        arrayTodosTextos.forEach(element => {
            let paragrafo = document.querySelector(`#texto${element.ordem}`)
            let texto = paragrafo.innerHTML
            paragrafo.outerHTML = "<textarea class=\"form-control\" name=\"test\" id=\"textoComum\" style=\"height: 300px;\"></textarea>"
            paragrafo = document.querySelector('#textoComum')
            paragrafo.innerHTML = texto
        });
        //Lê o elemento pelo id e o seu valor interno, muda o elemento de <textarea> para <p> e preserva o valor interno
        //Na próxima versão do arquivo, ao invés de preservar o valor apenas na variável, ele precisará encontrar e salvar o valor no DB
        let paragrafo = document.getElementById('textoComum')
        let texto = paragrafo.value
        paragrafo.outerHTML = "<p style=\"text-indent: 1em;\" id=\"textoComum\"></p>"
        paragrafo = document.querySelector('#textoComum')
        paragrafo.innerHTML = texto
    }
}