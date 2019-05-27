module.exports.entity_name = 'promesa'
module.exports.file_name = 'promesa'

module.exports.data = [
{name: 'promesa_id', type: 'string', required: true, min: 1, max: 36, searchable: false, reportable: true, timestamp: false, id: true, alias: 'p_promesa_id'},
{name: 'periodo_id', type: 'int', required: true, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: false, alias: 'p_periodo_id'},
{name: 'cliente_id', type: 'int', required: true, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: false, alias: 'p_cliente_id'},
{name: 'fecha_generacion', type: 'date', required: true, min: false, max: false, searchable: false, reportable: true, timestamp: false, id: false, alias: 'p_fecha_generacion'},
{name: 'no_empleado', type: 'int', required: true, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: false, alias: 'p_no_empleado'},
{name: 'cuenta', type: 'string', required: true, min: 1, max: 100, searchable: false, reportable: true, timestamp: false, id: false, alias: 'p_cuenta'},
{name: 'fecha_pago', type: 'date', required: true, min: false, max: false, searchable: false, reportable: true, timestamp: false, id: false, alias: 'p_fecha_pago'},
{name: 'no_empleado_autoriza', type: 'int', required: false, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: false, alias: 'p_no_empleado_autoriza'},
{name: 'periodo_ID_1', type: 'int', required: true, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: false, alias: 'p_periodo_ID_1'},
{name: 'periodo_ID_1_1', type: 'int', required: true, min: false, max: false, searchable: false, reportable: false, timestamp: false, id: false, alias: 'p_periodo_ID_1_1'}
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
