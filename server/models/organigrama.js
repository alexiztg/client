var entity_name = require('../data/organigrama').entity_name
var file_name = require('../data/organigrama').file_name
var data = require('../data/' + file_name).data
var relations = require('../data/' + file_name).relations
var views = require('../data/' + file_name).views

const uuidv4 = require('uuid/v4')

/********************************************
DIRECTORY - AGREGAR LA DEFINICION DE LAS FUNCIONES QUE SE IMPLEMENTEN EN 'FREE PLAYGROUND'
********************************************/

module.exports = {
  getAll: getAll,
  getFind: getFind,
  getView: getView,
  setNew: setNew,
  setUpdate: setUpdate
}

function getAll(d) {

  var i = 1
  var join_fields = ''
  var join_rels = ''
  var join_conditions = ''
  var all_data = {}
  relations.forEach(function (item) {
    var datarel = require('../data/' + item.entity).data
    var e_name = require('../data/' + item.entity).entity_name
    join_fields += ', ' + helpers.sqlFields(datarel, 'r' + i, true)
    join_rels += (item.strict ? ' INNER ' : ' LEFT ') + `JOIN ${e_name} AS r${i} ON r${i}.${item.foreign_id} = ${(item.order == 0 ? 'e' : 'r' + (item.order))}.${item.local_id}`
    if (d.relations && d.relations[i - 1]) {
      join_conditions += helpers.sqlConditions(datarel, d.relations[i - 1], 'r' + i)
    }
    all_data['r' + i] = datarel
    i++
  })

  var query = `SELECT
                  ${helpers.sqlFields(data, 'e', false)} ${join_fields}
                FROM
                  ${entity_name} AS e ${join_rels}
                WHERE
                  1 = 1 ${helpers.sqlConditions(data, d, 'e')} ${join_conditions}
                `

  all_data['e'] = data
  var inputs = helpers.sqlInputs(all_data)
  var d = helpers.prepareSQLData(d)

  return helpers.mssqlQuery('GET', conn, query, inputs, d)
}

function getFind(d) {

  var i = 1
  var join_fields = ''
  var join_rels = ''
  var join_conditions = ''
  relations.forEach(function (item) {
    var datarel = require('../data/' + item.entity).data
    var e_name = require('../data/' + item.entity).entity_name
    join_fields += ', ' + helpers.sqlFields(datarel, 'r' + i, true)
    join_rels += (item.strict ? ' INNER ' : ' LEFT ') + `JOIN ${e_name} AS r${i} ON r${i}.${item.foreign_id} = ${(item.order == 0 ? 'e' : 'r' + (item.order))}.${item.local_id}`
    join_conditions += helpers.sqlFind(datarel, 'r' + i)
    i++
  })

  var query = `SELECT
                  ${helpers.sqlFields(data, 'e', false)} ${join_fields}
                FROM
                  ${entity_name} AS e ${join_rels}
                WHERE
                  1 = 1 AND (${helpers.sqlFind(data, 'e')} ${join_conditions.length > 0 ? ' OR ' + join_conditions : ''})
                `

  var inputs = helpers.sqlInputs(data)
  inputs.push({nombre: 'query', tipo: sql.VarChar(250)})
  d.query = '%' + d.query + '%'

  return helpers.mssqlQuery('GET', conn, query, inputs, d)
}

function getView(d, view) {

  if (views[view]) {
    var i = 1
    var join_fields = ''
    var join_rels = ''
    var join_conditions = ''
    var all_data = {}
    relations.forEach(function (item) {
      var datarel = require('../data/' + item.entity).data
      var e_name = require('../data/' + item.entity).entity_name
      join_fields += ', ' + helpers.sqlFields(datarel, 'r' + i, true)
      join_rels += (item.strict ? ' INNER ' : ' LEFT ') + `JOIN ${e_name} AS r${i} ON r${i}.${item.foreign_id} = ${(item.order == 0 ? 'e' : 'r' + (item.order))}.${item.local_id}`
      if (d.relations && d.relations[i - 1]) {
        join_conditions += helpers.sqlConditions(datarel, d.relations[i - 1], 'r' + i)
      }
      all_data['r' + i] = datarel
      i++
    })

    var aggregation_fields = ''
    var af = views[view].aggregation_fields
    af.forEach(function (item) {
      aggregation_fields += `${(af.length > 0 ? ',' : '')} ${item.func}(e.${item.field}) AS ${item.name}`
    })

    var filtered_fields = views[view].fields.join(', ')

    var query = `
    SELECT ${filtered_fields} ${aggregation_fields}
    FROM
    (SELECT
      ${helpers.sqlFields(data, 'e', false)} ${join_fields}
    FROM
      ${entity_name} AS e ${join_rels}
    WHERE
      1 = 1 ${helpers.sqlConditions(data, d, 'e')} ${join_conditions}) AS e
    ${(af.length > 0 ? `GROUP BY ${filtered_fields}` : '')}
    `

    all_data['e'] = data
    var inputs = helpers.sqlInputs(all_data)
    var d = helpers.prepareSQLData(d)

    return helpers.mssqlQuery('GET', conn, query, inputs, d)
  } else {
    return new Promise(function (resolve, reject) {
      resolve({err: true, description: 'Vista inexistente'})
    })
  }

}

function setNew(d) {
  return new Promise(function (resolve, reject) {

    var new_uuid = uuidv4()
    if (helpers.getIdType(data) == 'string') {
      d[helpers.getIdName(data)] = new_uuid
    }

    var query = `INSERT INTO
    ${entity_name}
    (${helpers.arguments(data, ', ', '', false)})
    VALUES
    (${helpers.arguments(data, ', ', '@', false)});
    ${ helpers.getIdType(data) == 'string' ? `SELECT ${new_uuid} AS AS ${helpers.getIdName(data)}` : `SELECT IDENT_CURRENT('${entity_name}') AS ${helpers.getIdName(data)}` }
    `

    var inputs = helpers.sqlInputs(data)

    helpers.mssqlQuery('GET', conn, query, inputs, d)
    .then(function (res) {
      if (!res.err) {
        var response = {}
        response['err'] = false
        console.log('data', data);
        console.log('a', helpers.getIdName(data));
        response[helpers.getIdName(data)] = res.result[0][helpers.getIdName(data)]
        resolve(response)
      } else {
        resolve(res)
      }
    })

  })

}

function setUpdate(d) {

  var query = `UPDATE
                ${entity_name}
              SET
                ${helpers.getUpdateFields(data, d)}
              WHERE
                ${helpers.getIdName(data)} = @${helpers.getIdName(data)}
                `

  var inputs = helpers.sqlInputs(data)

  return helpers.mssqlQuery('SET', conn, query, inputs, d)
}

/********************************************
FREE PLAYGROUND - A PARTIR DE AQUI SE PUEDEN REALIZAR MODIFICARIONES PROPIAS DE LA APLICACIÓN
********************************************/

function generic(d) {
  var query = `
              SELECT * FROM tabla WHERE nombre = @nombre
                `

  var inputs = [{nombre: "nombre", tipo: sql.VarChar(20)}]

  return helpers.mssqlQuery('GET', conn, query, inputs, d)
}
