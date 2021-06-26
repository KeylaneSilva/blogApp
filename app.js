// Carregando os modulos
    const express = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    //const mongoose = require('mongoose')

// Configurações
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    // Mongoose
        // em breve

// Rotas

// Outros
const PORT = 8081
app.listen(PORT,() => {
    console.log('Servidor rodando com sucesso...')
})
