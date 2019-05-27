module.exports.entity_name = 'periodo'
module.exports.file_name = 'periodo'

module.exports.data = [
{name: 'periodo_id', type: 'int', required: true, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: true, alias: 'p_periodo_id'},
{name: 'anyo', type: 'int', required: true, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: false, alias: 'p_anyo'},
{name: 'mes', type: 'int', required: true, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: false, alias: 'p_mes'},
{name: 'activo', type: 'int', required: true, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: false, alias: 'p_activo'}
]

module.exports.relations = [
//  {entity: 'entity', local_id: 'local_id', foreign_id: 'foreign_id', strict: false, order: 0}
]

module.exports.views = {
  'view1': {fields: ['field1'], aggregation_fields: [{name: 'total', func: 'COUNT', field: 'field2'}]},
  'view2': {fields: ['field1', 'field2', 'field3'], aggregation_fields: []},
}

// Para hacer busquedas se manda un objeto { field1: value, field2: value, relations: [{field1: value, field2: value}] }
// Busqueda incluyente { field1: [value1, value2, value3] }
// Busqueda excluyente { field1: ['!', value1, value2, value3] }
// Busqueda por rangos { field1: {min: value1, max: value2} }
// Solo mayor que { field1: {min: value, max: false} }
// Solo menor que { field1: {min: false, max: false} }
