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
    require('./models/Postagem')
    require('./models/Categoria')
    const Postagem = mongoose.model('postagens')
    const Categoria = mongoose.model('categorias')
    const usuarios = require('./routes/usuario')
    const passport = require('passport')
    require('./config/auth')(passport)


// Configurações
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
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
    app.get('/', (req,res) => {
        Postagem.find().populate("categoria").sort({data: 'desc'}).lean().then((postagens) => {
            res.render("index", {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash("error_msg", "Está postagem não existe!")
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno!")
                res.redirect('/')
        })
    })

    // Página de categorias
    app.get('/categorias', (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render('categorias/index', {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao listar as categorias")
            res.redirect('/')
        })
    })

    // Linkando as categorias com as postagens
    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){
                Postagem.find({categoria: categoria._id}).then((postagens) => {
                    res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar os posts")
                    res.redirect('/')
                })
            }else{
                req.flash("error_msg", "Está categoria não existe!")
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro carregar a pagina de posts!")
            res.redirect('/')
        })
    })

    //Página de erro
    app.get('/404', (req, res) => {
        res.send('Erro 404')
    })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)

// Outros
    const PORT = 8081
    app.listen(PORT,() => {
        console.log('Servidor rodando na porta 8081')
    })
