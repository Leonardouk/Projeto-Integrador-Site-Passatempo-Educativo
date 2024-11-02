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

const imagens = require('./img.json')

async function conectarAoMongoDB() {
    await
    mongoose.connect('mongodb+srv://Leonardo:SENHAPI@cluster0.xt0db.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
}

async function cadastrar(ordemElemento, textoElemento) {
    await Texto.updateOne({ordem: ordemElemento}, {texto: textoElemento})
    console.log(await Texto.findOne({ordem: ordemElemento}))
}

app.get("/teste", async (req, res) => {
    const textos = await Texto.find()
    let arrayElementos = [textos, imagens]
    res.json(arrayElementos)
})

app.post("/teste", async (req, res) => {
    const arrayTodosTextos = req.body

    try{
        arrayTodosTextos.forEach(element => {
            cadastrar(element.ordem, element.texto)
        });
    }
    catch {
        console.log("Não rolou irmão")
    }

    const textos = await Texto.find()
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