const express = require ('express')
const multer = require ('multer')
const cors = require ('cors')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const app = express()
app.use(express.json())
app.use(cors())


//Criação de modelos para objetos do DB
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
    pagina: {type: Array, "default": []},
    src: {type: String},
    alt: {type: String}
}))

//Funções relacionadas ao DB
async function conectarAoMongoDB() {
    await
    mongoose.connect('mongodb+srv://Leonardo:SENHAPI@cluster0.xt0db.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
}

async function atualizarTexto(idElemento, textoElemento) {
    await Texto.updateOne({_id: idElemento}, {texto: textoElemento})
}

async function atualizarImagem(idElemento, ordemElemento) {
    await Imagem.updateOne({_id: idElemento}, {ordem: ordemElemento})
}

async function cadastrarImagem(srcImagem) {
    const imagem = new Imagem({ordem: 999, pagina: [], src: srcImagem, alt: srcImagem})
    await imagem.save()
}

//Requisições e respostas do backend
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
            atualizarTexto(element._id, element.texto)
        });
        arrayImagens.forEach(element => {
            atualizarImagem(element._id, element.ordem)
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

app.post("/remover", async (req, res) => {
    const idImagem = req.body._id
    const srcImagem = req.body.src
    const filePath = path.join(__dirname, '/img')
    console.log(idImagem, srcImagem)
    try {
        await Imagem.deleteOne({_id: req.body})
        fs.unlink(path.join(filePath, `/${srcImagem}`), (err) => err && console.error(err))
        console.log('Imagem deletada com sucesso')
    }
    catch (err) {
        console.error(err.message)
    }
})

const multerConfig = require("./config/multer")
app.post("/upload", multer(multerConfig).any(), async (req, res) => {
    const srcImagem = path.join('../img', `${req.files[0].filename}`)
    try {
        cadastrarImagem(srcImagem)
    }
    catch (err) {
        console.error(err.message)
    }
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