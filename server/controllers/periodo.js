var entity_name = require('../data/periodo').entity_name
var file_name = require('../data/periodo').file_name
var Model = require('../models/' + file_name)
var data = require('../data/' + file_name).data

var fs = require('fs')
var path = require('path')
var AdmZip = require('adm-zip')
var XLSX = require('xlsx')
var uuidv4 = require('uuid/v4')
var _ = require('lodash')

var XlsxPopulate = require('xlsx-populate')

var moment = require('moment')

/********************************************
DIRECTORY - AGREGAR LA DEFINICION DE LAS FUNCIONES QUE SE IMPLEMENTEN EN 'FREE PLAYGROUND'
********************************************/

module.exports = {
  getAll: getAll,
  getFind: getFind,
  getView: getView,
  getReport: getReport,
  setNew: setNew,
  setNewList: setNewList,
  setUpdate: setUpdate
}

function getAll(d) {
  return new Promise(function (resolve, reject) {
    Model.getAll(d)
    .then(function (res) {
      resolve(!res.err ? res.result : res)
    })
  })
}

function getFind(d) {
  return new Promise(function (resolve, reject) {
    if (d.query) {
      Model.getFind(d)
      .then(function (res) {
        resolve(!res.err ? res.result : res)
      })
    } else {
      resolve({err: true, description: 'Debes proporcionar un parámetro de búsqueda'})
    }
  })
}

function getView(d, view) {
  return new Promise(function (resolve, reject) {
    Model.getView(d, view)
    .then(function (res) {
      resolve(!res.err ? res.result : res)
    })
  })
}

function getReport(d) {
  return new Promise(function (resolve, reject) {
    d = d ? d : {}
    var func = d.query ? 'getFind' : d.view ? 'getView' : 'getAll'
    Model[func](d, d.view)
    .then(function (result) {
      if(!result.err && result.result && result.result.length > 0) {

        XlsxPopulate.fromBlankAsync()
        .then(workbook => {

        // Encabezados
        var col = 0
        var keys = []
        for(var k in result.result[0]) keys.push(k);

        for (i = 0; i < keys.length; i++) {
          workbook.sheet('Sheet1').cell(helpers.excel_col[col] + '1').value(keys[i])
          col++
        }

        var ren = 2
        result.result.forEach(function (item) {
          var col = 0
          for (i = 0; i < keys.length; i++) {
            workbook.sheet('Sheet1').cell(helpers.excel_col[col] + ren).value(item[keys[i]])
            col++
          }
          ren++
        })


          var archivo = uuidv4() + '.xlsx'
          workbook.toFileAsync(path.join('.', 'server', 'temp', archivo))

          var url = helpers.url() + entity_name + '/reporte/' + archivo
          resolve({err: false, url: url})
        })

      } else {
        resolve(result)
      }
    })
  })
}

function setNew(d) {
  return new Promise(function (resolve, reject) {
    console.log('recibimos', d);
    if (helpers.dataReady(d, data, true)) {
      data.forEach(function (item) {
        if (item.timestamp) {
          d[item.name] = moment().format('YYYY-MM-DD HH:mm:ss')
        }
      })

      Model.setNew(d)
      .then(function (res) {
        resolve(res)
      })
    } else {
      resolve({err: true, description: `Un ${entity_name} debe tener ${helpers.arguments(data, ', ', '', true)}`})
    }
  });
}

function setNewList(archivo, programar, fecha_envio, usuario_id) {
  return new Promise(function (resolve, reject) {
    var fin = 0
    var ren = 1

  	var workbook = XLSX.readFile(archivo)
  	var hojas = workbook.SheetNames

  	registros_procesados = 0

    var registros = []

    while(workbook.Sheets[hojas[0]]['A'+ ren] != undefined) {
      ren++
      registros.push({
        nombre: workbook.Sheets[hojas[0]]['A'+ ren] ? workbook.Sheets[hojas[0]]['A'+ ren].v : '',
        apellido_paterno: workbook.Sheets[hojas[0]]['B'+ ren] ? workbook.Sheets[hojas[0]]['B'+ ren].v : '',
        apellido_materno: workbook.Sheets[hojas[0]]['C'+ ren] ? workbook.Sheets[hojas[0]]['B'+ ren].v : '',
        email: workbook.Sheets[hojas[0]]['D'+ ren] ? workbook.Sheets[hojas[0]]['B'+ ren].v : ''
      })
    }
    registros.pop()

    nsp.emit(entity_name + ':registros_procesar', ren - 2 )

    var validos = 0
    var avance = 0
    var lista = []
    Promise.each(registros, function(registro) {
      return new Promise (function(resolve, reject) {
        setNew(registro)
        .then(function (res) {
          avance++
          console.log('result', res);
          lista.push(res)
          nsp.emit(entity_name + ':registros_procesados', {avance: avance, validos: validos, estudio: registro});
          resolve();
        })
      })
    }).then(function() {
      resolve({err: false, resultados: lista});
    })
  })
}

function setUpdate(d) {
  return new Promise(function (resolve, reject) {
    var id_name = helpers.getIdName(data)
    if (id_name) {
      if (d[id_name]) {
        Model.setUpdate(d)
        .then(function (res) {
          resolve(res)
        })
      } else {
        resolve({err: true, description: 'Para actualizar debes proporcionar un ID'})
      }
    } else {
      resolve({err: true, description: 'No existe un ID en esta entidad'})
    }
  })
}

/********************************************
FREE PLAYGROUND - A PARTIR DE AQUI SE PUEDEN REALIZAR MODIFICARIONES PROPIAS DE LA APLICACIÓN
********************************************/
