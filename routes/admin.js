const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model("categorias")

router.get('/', (req,res) => {
    res.render("admin/index")
})

router.get('/categorias', (req,res) => {
    res.render("admin/categorias")
})

router.get('/categorias/add', (req,res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) =>{
    // Validação do formulario
    var erros = []

    if(!req.body.nome && !req.body.slug){
            
    }
    
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() =>{
        console.log("Categoria salva com sucesso")
    }).catch((err) => {
        console.log("Eroo ao salvar categoria: "+err)
    })
})

module.exports = router