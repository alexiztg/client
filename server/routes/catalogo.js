var ctrl = require('../controllers/catalogo')
var express = require('express')
var router = express.Router()

router.get('/obtener/usuario', obtenerUsuario)

function obtenerUsuario(req, res) {
  ctrl.obtenerUsuario()
  .then(function (result) {
    res.json(result)
  })
}

module.exports = router