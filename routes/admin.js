const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.send("Página principal do ADM")
})

router.get('/posts', (req,res) => {
    res.send("Página dos POSTS")
})

router.get("/categorias", (req,res) => {
    res.send("Página de categoria")
})

module.exports = router