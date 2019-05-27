module.exports = {
    obtenerUsuario:obtenerUsuario
}

function obtenerUsuario() {

  var query = `
  select 
    cliente_id,
    fecha_alta,
    nombre,
    usuario_id,
    razon_social,
    activo,
    fecha_baja,
    nota
  from 
    cliente`
  var inputs = [ ]
  return helpers.mssqlQuery('GET', conn, query, inputs, {})
}

  
