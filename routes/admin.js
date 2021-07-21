const { json } = require('body-parser')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
require('../models/Postagem')
const Categoria = mongoose.model("categorias")
const Postagem = mongoose.model("postagens")

router.get('/', (req,res) => {
    res.render("admin/index")
})

// Página de form para add categoria
router.get('/categorias/add', (req,res) => {
    res.render("admin/addcategorias")
})

// Registrando categorias
router.post('/categorias/nova', (req, res) =>{
    // Validação do formulario
    var erros = []
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }
    if((req.body.nome).length < 2){
        erros.push({texto: "Nome da categoria muito pequeno!"})
    }
    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{ 
        
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        
        new Categoria(novaCategoria).save().then(() =>{
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao tentar salvar a categoria, tente novamente!")
            console.log("Eroo ao salvar categoria: "+err)
        })
    }
})

// Listando registros
router.get('/categorias', (req,res) => {
    Categoria.find().sort({data: 'desc'}).lean().then((categorias) => {
        //res.json(categorias)
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

// Capturando o id da categoria para editar
router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não exite")
        res.redirect("admin/categorias")
    })
})

// Registrando alteração no db - editar
router.post('/categorias/edit', (req, res) => {

    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a edição de categoria")
            res.redirect("admin/categorias")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria" + err)
        res.redirect("/admin/categorias")
    })
})

// Delete
router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucess!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao tentar apagar a categoria")
        res.redirect("admin/categorias")
    })
})

// Formulário de postagem
router.get("/postagens/add", (req, res) =>{
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

// Salvando postagens
router.post('/postagens/nova', (req, res) => {
    //Validação do form
    erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: 'Titulo inválido'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'Slug inválido'})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: 'Descrição inválida'})
    }
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: 'Conteúdo inválida'})
    }
    if(erros.length > 0){
        res.render("admin/addpostagens", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            data: req.body.data
        }
        
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem cadastrada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao tentar salvar a postagem, tente novamente!")
            console.log("Erro ao salvar postagem: "+err)
        })
    }   
})

// Listando postagens
router.get('/postagens', (req, res) => {
    Postagem.find().populate("categoria").sort({data: 'desc'}).lean().then((postagens) => {
        req.flash("success_msg", "Aqui")
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao tentar listar as tarefas" +err)
        res.redirect('/admin')

    })
})

// Capturando id das postagens
router.get('/postagens/edit/:id', (req, res) =>{
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagem", {categorias: categorias, postagem: postagem})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categoris")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar formulario de edição")
            res.redirect("/admin/postagens")
    })
})

// Editando postagens
router.post('/postagens/edit', (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a edição de postagens"+err)
            res.redirect("/admin/postagens")
        })
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao editar a postagem" + err)
        res.redirect("/admin/postagens")
    })
})

//Deletando postagens
router.post('/postagens/deletar', (req, res) => {
    Postagem.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso")
        res.redirect('/admin/postagens')
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao tentar deletar a postagem")
        res.redirect("admin/postagens")
    })
})

module.exports = router