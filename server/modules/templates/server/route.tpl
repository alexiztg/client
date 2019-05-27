var file_name = require('../data/{[entity_name]}').file_name
var data = require('../data/' + file_name).data
var ctrl = require('../controllers/' + file_name)

var express = require('express')
var router = express.Router()

var multer  = require('multer')
var upload = multer({ dest: 'cargas/' })
var path = require('path')
var fs = require('fs')

/********************************************
DIRECTORY - AGREGAR LA DEFINICION DE LAS FUNCIONES QUE SE IMPLEMENTEN EN 'FREE PLAYGROUND'
********************************************/

router.get('/', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), getAll)
router.get('/vista/:view', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), getView)
router.get('/buscar/:query', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), getFind)
router.get('/reporte', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), getReport)
router.get('/reporte/buscar/:query', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), getReportFind)
router.get('/reporte/:file', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), getReportFile)

router.get('/:id', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), get)

router.post('/', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), setNew)
router.post('/lista', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), upload.single('archivo'), setNewList)
router.post('/buscar', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), upload.single('archivo'), getAll)
router.post('/vista', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), getView)
router.post('/reporte', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), getReport)

router.put('/', helpers.isFirmado, helpers.hasPermiso([{[perfil_id]}]), setUpdate)


function getAll(req, res) {
  var d = req.body ? req.body : {}
  ctrl.getAll(d)
  .then(function (result) {
    res.json(result)
  })
}

function getView(req, res) {
  var d = req.body ? req.body : {}
  var view = req.params.view ? req.params.view : d.view
  ctrl.getView(d, view)
  .then(function (result) {
    res.json(result)
  })
}

function getFind(req, res) {
  var d = {query: req.params.query}
  ctrl.getFind(d)
  .then(function (result) {
    res.json(result)
  })
}

function getReport(req, res) {
  var d = req.body ? req.body : {}
  var view = req.params.view ? req.params.view : d.view
  ctrl.getReport(d, view)
  .then(function (result) {
    res.json(result)
  })
}

function getReportFind(req, res) {
  var d = {query: req.params.query}
  ctrl.getReport(d)
  .then(function (result) {
    res.json(result)
  })
}

function getReportFile(req, res) {
  var d = {file: req.params.file}
  var file = path.join('.', 'server', 'temp', d.file)

  fs.stat(file, function(err,stat) {
    if (!err) {
      fs.createReadStream(file).pipe(res)
    }else{
      res.json({err:true, description: 'No reporte no existe'})
    }
  });
}

function get(req, res) {
  var d = {}
  d[helpers.getIdName(data)] = req.params.id
  ctrl.getAll(d)
  .then(function (result) {
    res.json(result)
  })
}

function setNew(req, res) {
  var d = req.body
  d.usuario_id = req.session.usuario.usuario_id;
  ctrl.setNew(d)
  .then(function (result) {
    res.json(result)
  })
}

function setNewList(req, res) {
  var tipo = req.file.mimetype

  if(tipo == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || tipo == 'application/octet-stream') {
    fs.rename(req.file.path, path.join(__dirname, '1.xlsx'), function (err) {
      ctrl.setNewList(path.join(__dirname, '1.xlsx'), req.body.programar, req.body.fecha_envio, 1)
      res.json({err: false})
    })
  } else {
    res.json({err: true, description: 'Formato inválido'})
  }
}

function setUpdate(req, res) {
  var d = req.body
  d.usuario_id = req.session.usuario.usuario_id;
  ctrl.setUpdate(d)
  .then(function (result) {
    res.json(result)
  })
}

/********************************************
FREE PLAYGROUND - A PARTIR DE AQUI SE PUEDEN REALIZAR MODIFICARIONES PROPIAS DE LA APLICACIÓN
********************************************/


module.exports = router
