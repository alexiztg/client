var request = require('request')
var moment = require('moment')
var _ = require('lodash')
var path = require('path')

var url_acceso = 'https://app.gabssa.net/acceso/usuario/login'

module.exports.isProduccion = function() {
	return process.env.AMBIENTE_NODE == "produccion"
}

module.exports.getRutaArchivos = function() {
	if (module.exports.isProduccion()) {
		return path.join('/', 'mnt', 'data', 'imss')
	} else {
		return path.join('/', 'Users', 'alangl')
	}
}

module.exports.assetsUrl = function() {
  return module.exports.isProduccion() ? "https://app.gabssa.net/" : "https://app.gabssa.net/"
}

module.exports.url = function() {
  return module.exports.isProduccion() ? `https://${process.env.DOMINIO}/` + global.sistema + "/" : "https://localhost:" + global.puerto + "/"
}
module.exports.isFirmado = function(req, res, next) {
	if (req.session && req.session.usuario)
    next()
  else {
		if (req.headers.authorization) {
			request.post(url_acceso,{
		    form: {api_key: req.headers.authorization, sistema_id: global.sistema_id},
				rejectUnauthorized: false
		  },
	    function (err, res2, body) {
	      var bdy  = JSON.parse(body)
				console.log(bdy)
				if (!bdy.err) {
					req.session.usuario = bdy
					next()
				} else {
					res.redirect('/')
				}
	    })

		} else {
			res.redirect('/')
		}
	}
}

module.exports.hasPermiso = function(perfiles) {
	return function(req, res, next) {
		var perfil_id = module.exports.buscarPerfilActual(req.session.usuario.perfiles, global.sistema_id)
		var permitido = false
		perfiles.forEach(function (perfil) {
			permitido = permitido || perfil_id == perfil
		})

	  if (permitido) {
			if (req.headers.authorization) {
				setTimeout(function () {
						req.session.destroy(function() {
						  req.session = null
						  //res.clearCookie('connect.sid', { path: '/' })
						})
					}, 1500)
			}
			next()
		} else
			res.json({err: true, description: "No cuentas con privilegios para esta operación"})
	}
}

module.exports.buscarPerfilActual = function(perfiles, sistema_id) {
	var perfil_id = 0

	perfiles.forEach(function(perfil) {
		if(sistema_id == perfil.sistema_id) {
			perfil_id = perfil.perfil_id
		}
	})

	return perfil_id
}

module.exports.excel_col = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AF', 'AG', 'AH', 'AI', 'AJ']

module.exports.dataReady = function (d, data, required) {
	var ready = true;
	data.forEach(function (item) {
		console.log('item', item.name);
		//required review
		if ((item.required || !required) && !item.id) {
			ready = ready && d[item.name] != undefined
			console.log('error required', ready && d[item.name] != undefined);
		}

		var val = d[item.name]

		if (val) {
			//type review
			if (item.type === 'int') {
				ready = ready && !isNaN(val)
				console.log('error int', ready && Number.isInteger(val));
			}

			if (item.type === 'decimal') {
				ready = ready && !Number.isNaN(val) && !Number.isInteger(val)
				console.log('error decimal', ready && !Number.isNaN(val) && !Number.isInteger(val));
			}

			if (item.type === 'string') {
				ready = ready && typeof val === 'string'
				console.log('error string', ready && typeof val === 'string');
			}

			if (item.type === 'date' && !item.timestamp) {
				ready = ready && (moment(val, 'YYYY-MM-DD') || moment(val, 'YYYY-MM-DD HH:mm:ss'))
				console.log('error date', ready && (moment(val, 'YYYY-MM-DD') || moment(val, 'YYYY-MM-DD HH:mm:ss')));
			}

			if (!ready) {
				return false
			}

			//min max review
			if (item.min) {
				if (item.type === 'string') {
					ready = ready && val.length >= item.min
					console.log('error min', ready && val.length >= item.min);
				}
				if (item.type === 'int' || item.type === 'decimal') {
					ready = ready && val >= item.min
					console.log('error min', ready && val >= item.min);
				}
			}

			if (item.max) {
				if (item.type === 'string') {
					ready = ready && val.length <= item.max
					console.log('error max', ready && val.length <= item.max);
				}
				if (item.type === 'int' || item.type === 'decimal') {
					ready = ready && val <= item.max
					console.log('error max', ready && val <= item.max);
				}
			}
		}
	})
	return ready
}

module.exports.getIdName = function (data) {
	var found = undefined
	data.forEach(function (item) {
		if (item.id) {
			found = item.name
		}
	})
	return found
}

module.exports.getIdType = function (data) {
	var found = undefined
	data.forEach(function (item) {
		if (item.id) {
			found = item.type
		}
	})
	return found
}

module.exports.arguments = function (data, joiner, prefix, required) {
	var fields = []
	data.forEach(function (item) {
		if (!item.id || (item.id && item.type == 'string') ) {
			if(!required || item.required) {
				fields.push(prefix + item.name)
			}
		}
	})
	return fields.join(joiner)
}

module.exports.sqlFields = function (data, alias, add_alias) {
	var fields = '';
	data.forEach(function (item) {
		if (item.type === 'date') {
			fields += (fields.length > 0 ? ', ' : '') + ` CONVERT(VARCHAR(19), ${alias}.${item.name}, 120) AS ` + (add_alias ? `${item.alias}` : `${item.name}`)
		} else {
			fields += (fields.length > 0 ? ', ' : '') + ` ${alias}.${item.name}` + (add_alias ? ` AS ${item.alias}` : '')
		}
	})
	return fields
}

module.exports.sqlConditions = function (data, d, alias) {
	
	var conditions = '';
	data.forEach(function (item) {
		if (d[item.name] != undefined) {
			if (d[item.name] instanceof Array) {
				var arr = d[item.name]
				var operator = ''
				if (arr[0] === '!') {
					arr = arr.splice(1)
					operator = ' NOT '
				}
				conditions += ` AND ${alias}.${item.name} ${operator} IN ('${ arr.join("', '") }')`
			} else if (typeof d[item.name] == 'object') {
				var obj = d[item.name]
				if (d.max === false) {
					conditions += ` AND ${alias}.${item.name} > @${(alias != 'e' ? alias + '_' : '')}${item.name}`
				} else if (d.min === false) {
					conditions += ` AND ${alias}.${item.name} < @${(alias != 'e' ? alias + '_' : '')}${item.name}`
				} else {
					conditions += ` AND ${alias}.${item.name} BETWEEN @${(alias != 'e' ? alias + '_' : '')}${item.name} AND @${(alias != 'e' ? alias + '_' : '')}${item.name}_p`
				}
			} else {
				conditions += ` AND ${alias}.${item.name} = @${(alias != 'e' ? alias + '_' : '')}${item.name}`
			}
		}
	})
	return conditions
}

module.exports.sqlFind = function (data, alias) {
	var find = '';
	data.forEach(function (item) {
		if (item.searchable) {
			find += (find.length > 0 ? ' OR ' : '') + ` ${alias}.${item.name} LIKE @query`
		}
	})
	return find
}

module.exports.sqlInputs = function (data) {
	var inputs = []
	if (data instanceof Array) {
		data.forEach(function (item) {
			var sql_type = null
			if (item.type === 'string') {
				sql_type = sql.VarChar(item.max)
			}
			if (item.type === 'int') {
				sql_type = sql.Int
			}
			if (item.type === 'date') {
				sql_type = sql.VarChar(19)
			}
			if (item.type === 'decimal') {
				sql_type = sql.Decimal(20,2)
			}
			inputs.push({nombre: item.name, tipo: sql_type})
		})
	} else if (typeof data == 'object') {
		for(var k in data) {
			data[k].forEach(function (item) {
				var sql_type = null
				if (item.type === 'string') {
					sql_type = sql.VarChar(item.max)
				}
				if (item.type === 'int') {
					sql_type = sql.Int
				}
				if (item.type === 'date') {
					sql_type = sql.VarChar(19)
				}
				if (item.type === 'decimal') {
					sql_type = sql.Decimal(20,2)
				}
				inputs.push({nombre: (k == 'e' ? '' : k + '_') + item.name, tipo: sql_type})
				inputs.push({nombre: (k == 'e' ? '' : k + '_') + item.name + '_p', tipo: sql_type})
			})
		}
	}
	return inputs
}

module.exports.prepareSQLData = function (d) {
	for(var k in d) {
		if (d[k] instanceof Array) {

		} else if (typeof d[k] == 'object') {
			if (d[k].max === false) {
				d[k] = d[k].min
			} else if (d.min === false) {
				d[k] = d[k].max
			} else {
				d[k + '_p'] = d[k].max
				d[k] = d[k].min
			}
		}

		if (k == 'relations') {
			var lista = d[k]
			var i = 1
			lista.forEach(function (e) {
				for(var k in e) {
					if (e[k] instanceof Array) {

					} else if (typeof e[k] == 'object') {
						if (e[k].max === false) {
							d['r' + i + "_" + k] = e[k].min
						} else if (d.min === false) {
							d['r' + i + "_" + k] = d[k].max
						} else {
							d['r' + i + "_" + k + '_p'] = d[k].max
							d['r' + i + "_" + k] = d[k].min
						}
					} else {
						d['r' + i + "_" + k] = e[k]
					}
				}
				i++
			})
			delete d[k]
		}
	}

	return d
}

module.exports.getUpdateFields = function (data, d) {
	var update_fields = []
	data.forEach(function (item) {
		if(d[item.name] != undefined && !item.id) {
			update_fields.push(item.name + ' = @' + item.name)
		}
	})
	return update_fields.join(', ')
}

module.exports.mssqlQuery = function (tipo, c, query, inputs, d) {
  return new Promise(function(resolve, reject) {

    var ps1 = new sql.PreparedStatement(c)

		inputs.forEach(function(input) {
			ps1.input(input.nombre, input.tipo)
		})

		// console.log("tipo", tipo)
		// console.log("query", query)
		// console.log("inputs", inputs)
		// console.log("d", d)

    ps1.prepare(query, function(err) {

      if(err) {
				console.log("err", err)
        resolve({err: true, description: err})
        process.exit(1)
      } else {
        ps1.execute(d, function(err, rs) {
          if(err) {
						console.log("err", err)
            resolve({err: true, description: err})
            process.exit(1)
          } else {
            ps1.unprepare(function(err) {
							if(tipo == 'GET') {
								resolve({err: false, result: rs})
							} else {
								resolve({err: false})
							}
            })
          }
        })
      }

    })
  })
}

module.exports.mysqlQuery = function (tipo, c, query, d) {
  return new Promise(function(resolve, reject) {

		console.log("tipo", tipo)
		console.log("query", query)
		console.log("d", d)

    c.query(query, d, function(err, rs) {
      if(err) {
				console.log("err", err)
        resolve({err: true, description: err})
        process.exit(1)
      } else {

				if(tipo == 'GET') {
					resolve({err: false, result: rs})
				} else {
					resolve({err: false})
				}

      }
    })

  })
}
