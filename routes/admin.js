const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model("categorias")

router.get('/', (req,res) => {
    res.render("admin/index")
})

// Página de form para add categoria
router.get('/categorias/add', (req,res) => {
    res.render("admin/addcategorias")
})

// Listando registros
router.get('/categorias', (req,res) => {
    Categoria.find().sort({data: 'desc'}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
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

// Capturando o id da categoria 
router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não exite")
        res.redirect("admin/categorias")
    })
})

// Registrando alteração no db
router.post("/categorias/edit", (req, res) => {

    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a edição de categoria")
            res.redirect("/admin/categorias")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})



module.exports = router