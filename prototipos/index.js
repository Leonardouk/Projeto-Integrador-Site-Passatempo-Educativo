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
    pagina: {type: String},
    texto: {type: String}
}))

async function conectarAoMongoDB() {
    await
    mongoose.connect('mongodb+srv://Leonardo:SENHAPI@cluster0.xt0db.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
}

app.get("/teste", async (req, res) => {
    const admins = await Admin.find()
    res.json(admins)
})

app.post("/teste", async (req, res) => {
    const textos = await Texto.find()
    console.log(textos)
    res.json(textos)
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