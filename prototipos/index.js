const express = require ('express')
const cors = require ('cors')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
app.use(cors())

const Admin = mongoose.model ("Admin", mongoose.Schema({
    login: {type: String},
    senha: {type: String}
}))
const Texto = mongoose.model("Texto", mongoose.Schema({
    ordem: {type: Number},
    pagina: {type: String},
    texto: {type: String}
}))

const Imagem = mongoose.model("Imagen", mongoose.Schema({
    ordem: {type: Number},
    pagina: {type: String},
    src: {type: String},
    alt: {type: String}
}))

async function conectarAoMongoDB() {
    await
    mongoose.connect('mongodb+srv://Leonardo:SENHAPI@cluster0.xt0db.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
}

async function cadastrarTexto(idElemento, textoElemento) {
    await Texto.updateOne({_id: idElemento}, {texto: textoElemento})
}

async function cadastrarImagem(idElemento, ordemElemento) {
    await Imagem.updateOne({_id: idElemento}, {ordem: ordemElemento})
}

app.get("/teste", async (req, res) => {
    const textos = await Texto.find()
    const imagens = await Imagem.find()
    let arrayElementos = [textos, imagens]
    res.json(arrayElementos)
})

app.post("/teste", async (req, res) => {
    const arrayTextos = req.body[0]
    const arrayImagens = req.body[1]

    try{
        arrayTextos.forEach(element => {
            console.log(element._id)
            cadastrarTexto(element._id, element.texto)
        });
        arrayImagens.forEach(element => {
            console.log(element._id, element.ordem)
            cadastrarImagem(element._id, element.ordem)
        })
    }
    catch (e) {
        console.error(e)
        res.status(404).end()
    }

    const textos = await Texto.find()
    const imagens = await Imagem.find()
    let arrayElementos = [textos, imagens]
    res.json(arrayElementos)
})

app.listen(3000, () => {
    try{
        conectarAoMongoDB()
        console.log("up and running")
    }
    catch{
        console.log('Erro', e)
    }
})