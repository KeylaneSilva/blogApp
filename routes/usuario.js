const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/registro', (req, res) =>{
    res.render('usuario/registro')

})

router.post('/registro', (req, res) => {
    erros = []
    // Validação do form
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido!"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida!"})
    }
    if(req.body.senha.length < 4 ){
        erros.push({texto: "Senha pequena!"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senha são diferentes, tente novamente!"})
    }

    if(erros.length > 0){
        res.render('usuario/registro', {erros: erros})

    }else{
        //Verifica se o usuário já tem conta de email registrada
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Usuário com conta de email já cadastrada")
                res.redirect('/usuario/registro')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                
                //haseando a senha com bcrypt
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) =>{
                        if(erro){
                           req.flash('error_msg', 'Houve um erro durante o salvamento do usuário')
                           res.redirect('/') 
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", 'Usuário criado com sucesso!')
                            res.redirect('/')
                        }).catch((err) => {
                            req.flash('error_msg', 'Houve um erro ao tentar criar o usúario, tente novamente!')
                            res.redirect('/usuario/registro')
                        })
                    })
                })

            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect('/')
        })

        }
})

router.get('/login', (req, res) => {
    res.render('usuario/login')
})

// Autenticando
router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})

module.exports = router