// Carregando os modulos
    const express = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const admin = require('./routes/admin.js')
    const mongoose = require('mongoose')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')

// Configurações
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })    

    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp").then(() =>{
            console.log("Conectado com sucesso")
        }).catch((err) => {
            console.log("Houve um erro ao se conectar com o banco: "+err)
        })
    // Public
        app.use(express.static(path.join(__dirname, "public")))

    

// Rotas
    app.get("/", (req,res) => {
        res.send("Pagina princiapal")
    } )

    app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT,() => {
    console.log('Servidor rodando na porta 8081')
})
