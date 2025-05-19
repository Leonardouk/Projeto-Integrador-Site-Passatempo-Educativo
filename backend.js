const express = require('express')
const multer = require('multer')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

const adminSchema = mongoose.Schema({
    login: {type: String, required: true, unique: true},
    senha: {type: String, required: true}
})
adminSchema.plugin(uniqueValidator)
const Admin = mongoose.model("Admin", adminSchema)
const Texto = mongoose.model("Texto", mongoose.Schema({
    pagina: {type: Object, "default": [{type: Object, "default": [{type: Number}]}]},
    texto: {type: String}
}))
const Imagem = mongoose.model("Imagen", mongoose.Schema({
    pagina: {type: Object, "default": [{type: Object, "default": [{type: Number}]}]},
    alt: {type: String},
    src: {type: String}
}))
const Session = mongoose.model("Session", mongoose.Schema({
    sessionID: {type: String},
    startTime: {type: String}, 
    endTime: {type: String},   
    sessionDuration: {type: String}, 
    userAgent: {type: String},
    ipAddress: {type: String},
    url: {type: String},
    referrer: {type: String}
}))

async function atualizarTexto(idElemento, textoElemento) {
    await Texto.updateOne({_id: idElemento}, {texto: textoElemento})
}

async function atualizarImagem(idElemento, ordemElemento, paginaElemento) {
    await Imagem.updateOne({_id: idElemento}, {pagina: {[paginaElemento]: ordemElemento}})
}

async function cadastrarImagem(srcImagem) {
    const imagem = new Imagem({pagina: [], src: srcImagem, alt: srcImagem})
    await imagem.save()
}

app.get("/dados", async(req, res) => {
    const textos = await Texto.find()
    const imagens = await Imagem.find()
    let arrayElementos = [textos, imagens]
    res.json(arrayElementos)
})

app.post("/dados", async (req, res) => {
    const token = req.body.token
    try {
        const tokenDecrypt = jwt.verify(token, process.env.JWT_KEY)
        const usuarioExiste = await Admin.findOne({login: tokenDecrypt.login})
        if (usuarioExiste) {
            const arrayTextos = req.body[0]
            const arrayImagens = req.body[1]

            try{
                arrayTextos.forEach(element => {
                    atualizarTexto(element._id, element.texto)
                });
                arrayImagens.forEach(element => {
                    atualizarImagem(element._id, element.ordem, element.pagina)
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
            res.status(200).end()
        }
        else {
            return res.status(401)    
        }
    }
    catch (err) {
        console.error("Erro ao verificar o token:", err)
        res.status(400).json({login: false})
    }
})

// app.post("/signup", async(req, res) => {
//     try {
//         const login = req.body.login
//         const senha = req.body.senha
//         const senhaCriptografada = await bcrypt.hash(senha, 10)
//         const admin = new Admin({login: login, senha: senhaCriptografada})
//         const respMongo = await admin.save()
//         console.log(respMongo)
//         res.status(201).end()
//     }
//     catch (e) {
//         console.log(e)
//         res.status(409).end()
//     }
// })

app.post("/checarLogin", async(req, res) => {
    const token = req.body.token
    try {
        const tokenDecrypt = jwt.verify(token, process.env.JWT_KEY)
        const usuarioExiste = await Admin.findOne({login: tokenDecrypt.login})
        if (usuarioExiste) {
            console.log("Token válido: ", token)
            res.status(200).json({login: true})
        }
        else {
            console.log("Token não é de admin: ", token)
            return res.status(401).json({login: false})        
        }
    }
    catch (err) {
        console.error("Erro ao verificar o token:", err)
        res.status(400).json({login: false})
    }
})

app.post("/login", async(req, res) => {
    const login = req.body.login
    const senha = req.body.senha
    const usuarioExiste = await Admin.findOne({login: login})
    if (!usuarioExiste) {
        return res.status(401).json({mensagem: "Login inválido"})        
    }
    const senhaValida = await bcrypt.compare(senha, usuarioExiste.senha)
    if (!senhaValida) {
        return res.status(401).json({mensagem: "Senha inválida"})
    }

    const token = jwt.sign(
        {login: login},
        process.env.JWT_KEY,
        {expiresIn: "3h"}
    )

    res.status(200).json({token: token}).end()
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

let itemAdicionado = ""
const multerConfig = require("./config/multer")
app.post("/upload", multer(multerConfig).any(), async (req, res) => {
    const srcImagem = path.join('../img', `${req.files[0].filename}`)
    try {
        cadastrarImagem(srcImagem)
        itemAdicionado = await Imagem.findOne({src: srcImagem})
    }
    catch (err) {
        console.error(err.message)
    }
})

/**
 * Códigos referentes à estatica.js e consulta_dados.html
 * Eles estão comentados até eu confirmar se eles devem ser deletados ou não.
 */

// app.post('/log-sessao', (req, res) => {
//     console.info('Requisição POST recebida!')
//     const { startTime, endTime, sessionDuration, referrer } = req.body

//     const origin = req.get('Origin')
//     const referer = req.get('Referer')
//     const url = origin || referer || 'URL desconhecida'

//     const session = new Session({
//         sessionId: uuidv4(),
//         startTime: formatDate(startTime),        
//         endTime: formatDate(endTime),            
//         sessionDuration: formatDuration(sessionDuration), 
//         userAgent: req.get('User-Agent'),
//         ipAddress: req.ip,
//         url,
//         referrer
//     })

//     session.save()
//         .then(() => {
//             res.status(201).json({
//                 message: 'Sessão salva com sucesso!',
//                 sessionDetails: session
//             })
//         })
//         .catch(err => {
//             console.error('Erro ao salvar sessão:', err.message)
//             res.status(500).send('Erro ao salvar sessão.')
//         })
// });
// function formatDate(timestamp) {
//     const date = new Date(timestamp)
//     return date.toLocaleString()
// }
// function formatDuration(duration) {
//     return `${(duration / 1000).toFixed(2)} segundos`
// }

// app.get('/log-sessao', (req, res) => {
//     Session.find({})
//         .then(sessions => {
//             const formattedSessions = sessions.map(session => ({
//                 sessionId: session.sessionId,
//                 startTime: formatDate(session.startTime),
//                 endTime: formatDate(session.endTime),
//                 sessionDuration: formatDuration(session.sessionDuration),
//                 userAgent: session.userAgent,
//                 ipAddress: session.ipAddress,
//                 url: session.url,
//                 referrer: session.referrer
//             }));

//             res.status(200).json(formattedSessions);  // Responde com os dados formatados
//         })
//         .catch(err => {
//             console.error('Erro ao buscar sessões:', err.message);
//             res.status(500).send('Erro ao buscar sessões.');
//         });
// });

async function conectarAoMongoDB() {
    await mongoose.connect(process.env.MONGODB_KEY)
}

app.listen(3000, () => {
    try {
        conectarAoMongoDB()
        console.log("Up and Running")
    }
    catch (e) {
        console.log("Erro de conexão", e)
    }
})