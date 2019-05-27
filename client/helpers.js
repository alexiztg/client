this.getProduccion = function() {
  return process.env.AMBIENTE_NODE == "produccion";
}

this.getUrl = function() {
  return this.getProduccion() ? "https://" + process.env.DOMINIO + "/" + SISTEMA + "/" : "https://localhost:" + PUERTO;
}

this.getLocation = function() {
  return this.getProduccion() ? "/" + SISTEMA : "";
}

this.getNamespace = function() {
  return this.getProduccion() ? "" : "/" + SISTEMA + "/";
}

this.getUrlAcceso = function() {
  return this.getProduccion() ? "https://" + process.env.DOMINIO + "/acceso" : "https://" + process.env.DOMINIO + "/acceso";
}

this.buscarPerfilActual = function(perfiles, sistema_id) {
	var perfil_id = 0

	perfiles.forEach(function(perfil) {
		if(sistema_id == perfil.sistema_id) {
			perfil_id = perfil.perfil_id
		}
	})

	return perfil_id
}

this.dataReady = function (d, data) {
	var ready = true;
	data.forEach(function (item) {
		//required review
		if (item.required && !item.id) {
			ready = ready && d[item.name] != undefined
		}

		var val = d[item.name]

		if (val) {
			//type review
			if (item.type === 'int') {
				ready = ready && Number.isInteger(val)
			}

			if (item.type === 'decimal') {
				ready = ready && !Number.isNaN(val) && !Number.isInteger(val)
			}

			if (item.type === 'string') {
				ready = ready && typeof val === 'string'
			}

			if (item.type === 'date' && !item.timestamp) {
				ready = ready && Number.isNaN(val) && (moment(val, 'YYYY-MM-DD') || moment(val, 'YYYY-MM-DD HH:mm:ss'))
			}

			if (!ready) {
				return false
			}

			//min max review
			if (item.min) {
				if (item.type === 'string') {
					ready = ready && val.length >= item.min
				}
				if (item.type === 'int' || item.type === 'decimal') {
					ready = ready && val >= item.min
				}
			}

			if (item.max) {
				if (item.type === 'string') {
					ready = ready && val.length <= item.max
				}
				if (item.type === 'int' || item.type === 'decimal') {
					ready = ready && val <= item.max
				}
			}
		}
	})
	return ready
}

this.getIdName = function (data) {
  var found = undefined
	data.forEach(function (item) {
		if (item.id) {
			found = item.name
		}
	})
	return found
}

this.initInterfaz = function() {
  $('#menu').click(function () {
    $('#menu-izquierdo').sidebar('toggle');
  });

  $('#notificaciones').click(function () {
    $('#menu-derecho').sidebar('toggle');
  });

  $('.ui.accordion').accordion();

  $('.menu .item').tab();

}
