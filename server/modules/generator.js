var fs = require('fs')
var path = require('path')

var operation = process.argv[2]
var entity_name = process.argv[3]
var perfil_id = process.argv[4]

var files = []

if (operation == 1 || operation == 2 || operation == 3) {
  files = [
              {type: 'server', name: 'controller.tpl', output_folder: 'controllers'},
              {type: 'server', name: 'data.tpl', output_folder: 'data'},
              {type: 'server', name: 'model.tpl', output_folder: 'models'},
              {type: 'server', name: 'route.tpl', output_folder: 'routes'},
              // {type: 'client', name: 'controller.tpl', output_folder: 'controllers'},
              {type: 'client', name: 'service.tpl', output_folder: 'services'},
              {type: 'views', name: '_new.tpl', output_folder: 'views/partials/{[entity_name]}/'},
              {type: 'views', name: '_list.tpl', output_folder: 'views/partials/{[entity_name]}/'}
  ]
}

if (operation == 4 || operation == 5) {
  files = [
    {type: 'client', name: 'view-controller.tpl', output_folder: 'controllers'},
    {type: 'views', name: 'view.tpl', output_folder: 'views'}
  ]
}

var data_types = {
  '1': `{name: '[[COLUMN_NAME]]', type: 'int', required: [[NULLABLE]], min: false, max: false, searchable: false, reportable: false, timestamp: false, id: [[IDENTITY]], alias: '[[PREFIX]]_[[COLUMN_NAME]]'}`,
  '4': `{name: '[[COLUMN_NAME]]', type: 'int', required: [[NULLABLE]], min: false, max: false, searchable: false, reportable: false, timestamp: false, id: [[IDENTITY]], alias: '[[PREFIX]]_[[COLUMN_NAME]]'}`,
  '5': `{name: '[[COLUMN_NAME]]', type: 'int', required: [[NULLABLE]], min: false, max: false, searchable: false, reportable: false, timestamp: false, id: [[IDENTITY]], alias: '[[PREFIX]]_[[COLUMN_NAME]]'}`,
  '-6': `{name: '[[COLUMN_NAME]]', type: 'int', required: [[NULLABLE]], min: false, max: false, searchable: false, reportable: false, timestamp: false, id: [[IDENTITY]], alias: '[[PREFIX]]_[[COLUMN_NAME]]'}`,

  '11': `{name: '[[COLUMN_NAME]]', type: 'date', required: [[NULLABLE]], min: false, max: false, searchable: false, reportable: true, timestamp: false, id: false, alias: '[[PREFIX]]_[[COLUMN_NAME]]'}`,

  '3': `{name: '[[COLUMN_NAME]]', type: 'decimal', required: [[NULLABLE]], min: false, max: false, searchable: false, reportable: true, timestamp: false, id: false, alias: '[[PREFIX]]_[[COLUMN_NAME]]'}`,

  '12': `{name: '[[COLUMN_NAME]]', type: 'string', required: [[NULLABLE]], min: 1, max: [[LENGTH]], searchable: false, reportable: true, timestamp: false, id: [[IDENTITY]], alias: '[[PREFIX]]_[[COLUMN_NAME]]'}`,
  '-1': `{name: '[[COLUMN_NAME]]', type: 'string', required: [[NULLABLE]], min: 1, max: [[LENGTH]], searchable: false, reportable: true, timestamp: false, id: false, alias: '[[PREFIX]]_[[COLUMN_NAME]]'}`,
}

var views_new = {
  number: `<div class="one field">
  <div class="field">
    <label for="[[COLUMN_NAME]]">[[COLUMN_NAME]]</label>
    <input type="number" id="[[COLUMN_NAME]]" ng-model="new_[[ENTITY_NAME]].[[COLUMN_NAME]]">
  </div>
</div>`,
  date: `<div class="one field">
  <div class="field">
    <label for="[[COLUMN_NAME]]">[[COLUMN_NAME]]</label>
    <input type="date" id="[[COLUMN_NAME]]" ng-model="new_[[ENTITY_NAME]].[[COLUMN_NAME]]">
  </div>
</div>`,
  string: `<div class="one field">
  <div class="field">
    <label for="[[COLUMN_NAME]]">[[COLUMN_NAME]]</label>
    <input type="text" id="[[COLUMN_NAME]]" ng-model="new_[[ENTITY_NAME]].[[COLUMN_NAME]]" maxlength="[[LENGTH]]">
  </div>
</div>`,
  long_string: `<div class="one field">
  <div class="field">
    <label for="[[COLUMN_NAME]]">[[COLUMN_NAME]]</label>
    <textarea id="[[COLUMN_NAME]]" rows="4" cols="80" ng-model="new_[[ENTITY_NAME]].[[COLUMN_NAME]]" maxlength="[[LENGTH]]"></textarea>
  </div>
</div>`,
  foreign: `<div class="one field">
  <div class="field">
    <label for="[[COLUMN_NAME]]">[[COLUMN_NAME]]</label>
    <select id="[[COLUMN_NAME]]" class="ui fluid dropdown" ng-model="new_[[ENTITY_NAME]].[[COLUMN_NAME]]" ng-options="item.id as item.nombre for item in coleccion">
    </select>
  </div>
</div>`
}

var views_list_headers = {
  number: `     <th ng-click="orden = '[[COLUMN_NAME]]'">[[COLUMN_NAME]]</th>`,
  string: `     <th ng-click="orden = '[[COLUMN_NAME]]'">[[COLUMN_NAME]]</th>`
}

var views_list_columns = {
  number: `     <td class="ui right aligned">{[ i.[[COLUMN_NAME]] ]}</td>`,
  string: `     <td class="ui left aligned">{[ i.[[COLUMN_NAME]] | capitalize ]}</td>`
}


var main = require('../models/main')

if (operation == 1 && entity_name && entity_name.length > 2) {

  main.start()
  .then(function (res) {

    helpers.mssqlQuery('GET', conn, `exec sp_columns @table_name = '${entity_name}'`, [], {})
    .then(function (columns) {

      files.forEach(function (file) {
        var archivo = null;
        archivo = fs.readFileSync(path.join(__dirname, 'templates', file.type, file.name), 'utf8')
        archivo = archivo.split('{[entity_name]}').join(entity_name)
        archivo = archivo.split('{[perfil_id]}').join(perfil_id ? perfil_id : '1')

        // console.log('file', file.name);

        if (file.name == 'data.tpl') {
          var names = entity_name.split('_')
          var prefix = ''
          names.forEach(function (i) {
            prefix += i.substr(0,1)
          })


          columns = columns.result
          var data_columns = ''
          for (var x = 0; x < columns.length; x++) {
            var i = columns[x]
            var identity = (i.TYPE_NAME.split(' ')[1] && i.TYPE_NAME.split(' ')[1] == 'identity') || (i.ORDINAL_POSITION == 1 && i.TYPE_NAME == 'varchar' && i.PRECISION == 36)
            var column = data_types[i.DATA_TYPE + '']
            console.log('i', i);
            console.log('identity', identity);

            column = column.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            column = column.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            column = column.replace('[[PREFIX]]', prefix)
            column = column.replace('[[LENGTH]]', i.LENGTH)
            column = column.replace('[[NULLABLE]]', i.NULLABLE && !identity ? 'false' : 'true')
            column = column.replace('[[IDENTITY]]', identity ? 'true' : 'false')

            data_columns += (column + (x < columns.length - 1 ? ',\n' : '' ) )
          }
          archivo = archivo.replace('{[data_columns]}', data_columns)
        }

        if (file.name == '_new.tpl') {
          //columns = columns.result
          var new_form = ''
          for (var x = 0; x < columns.length; x++) {
            var i = columns[x]

            var identity = i.TYPE_NAME.split(' ')[1] && i.TYPE_NAME.split(' ')[1] == 'identity'
            var has_id_in_name = i.COLUMN_NAME.indexOf('_id') > 1
            var data_type = i.DATA_TYPE
            var field_type = ''

            if (data_type == 1 || data_type == 4 || data_type == 5 || data_type == -6 || data_type == 3) {
              field_type = 'number'
            }

            if (data_type == 11) {
              field_type = 'date'
            }

            if (data_type == 12) {
              field_type = 'string'
              if (i.LENGTH > 120) {
                field_type = 'long_string'
              }
            }

            if (data_type == -1) {
              field_type = 'long_string'
            }

            if (field_type == 'number' && has_id_in_name && !identity) {
              field_type = 'foreign'
            }

            var column = views_new[field_type]

            if (identity) {
              column = ''
            }

            column = column.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            column = column.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            column = column.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            column = column.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            column = column.replace('[[LENGTH]]', i.LENGTH)

            column = column.replace('[[ENTITY_NAME]]', entity_name)

            new_form += (column + (x < columns.length - 1 ? '\n' : '' ) )
          }
          archivo = archivo.replace('{[new_form]}', new_form)

          archivo = archivo.replace('{[entity_name]}', entity_name)
          archivo = archivo.replace('{[entity_name]}', entity_name)
          archivo = archivo.replace('{[entity_name]}', entity_name)
          archivo = archivo.replace('{[entity_name]}', entity_name)
          archivo = archivo.replace('{[entity_name]}', entity_name)
        }

        if (file.name == '_list.tpl') {
          //columns = columns.result
          var list_headers = ''
          var list_columns = ''
          for (var x = 0; x < columns.length; x++) {
            var i = columns[x]

            var data_type = i.DATA_TYPE
            var field_type = ''

            if (data_type == 1 || data_type == 4 || data_type == 5 || data_type == -6 || data_type == 3) {
              field_type = 'number'
            }

            if (data_type == -1 || data_type == 11 || data_type == 12) {
              field_type = 'string'
            }

            var header = views_list_headers[field_type]
            header = header.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            header = header.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            list_headers += (header + (x < header.length - 1 ? '\n' : '' ) )

            var column = views_list_columns[field_type]
            column = column.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            column = column.replace('[[COLUMN_NAME]]', i.COLUMN_NAME)
            list_columns += (column + (x < columns.length - 1 ? '\n' : '' ) )
          }
          archivo = archivo.replace('{[list_headers]}', list_headers)
          archivo = archivo.replace('{[list_columns]}', list_columns)

          archivo = archivo.replace('{[entity_name]}', entity_name)
        }


        if (file.type == 'server') {
          fs.writeFileSync(path.join(__dirname, '..', file.output_folder, entity_name + '.js'), archivo)
        }

        if (file.type == 'client') {
          fs.writeFileSync(path.join(__dirname, '..', '..', 'client', file.output_folder, entity_name + '.js'), archivo)
        }

        if (file.type == 'views') {
          var directory = path.join(__dirname, '..', '..', 'client', file.output_folder.replace('{[entity_name]}', entity_name))
          if ( !fs.existsSync(directory) )  {
            fs.mkdirSync(directory)
          }
          fs.writeFileSync(path.join(__dirname, '..', '..', 'client', file.output_folder.replace('{[entity_name]}', entity_name),  file.name.split('.')[0] + '.hbs'), archivo)
        }

        console.log(`Se ha generado el ${file.type} ${file.name.split('.')[0]}`)
      })


      // Agrega la ruta en el server app
      var app = fs.readFileSync( path.join(__dirname, '..', '..', 'app.js'), 'utf8')
      if (app.indexOf(`app.use('/${entity_name}', require('./server/routes/${entity_name}'))`) == -1) {
        app = app.replace('})//<---- EOF ---->', 
`  app.use('/${entity_name}', require('./server/routes/${entity_name}'))
})//<---- EOF ---->`)
        fs.writeFileSync( path.join(__dirname, '..', '..', 'app.js'), app)
      }

      // Agrega el servicio en el client app
      var app = fs.readFileSync( path.join(__dirname, '..', '..', 'client', 'app.js'), 'utf8')
      if (app.indexOf(`require('./services/${entity_name}');`) == -1) {
        app = app.replace('//<---- EOF ---->', 
`require('./services/${entity_name}');
//<---- EOF ---->`)
        fs.writeFileSync( path.join(__dirname, '..', '..', 'client', 'app.js'), app)
      }

      process.exit(0)

    })



  })


}

if (operation == 2) {
  files.forEach(function (file) {

    if (file.type == 'server') {
      fs.unlinkSync(path.join(__dirname, '..', file.output_folder, entity_name + '.js'))
    }

    if (file.type == 'client') {
      fs.unlinkSync(path.join(__dirname, '..', '..', 'client', file.output_folder, entity_name + '.js'))
    }

    if (file.type == 'views') {
      fs.unlinkSync(path.join(__dirname, '..', '..', 'client', file.output_folder.replace('{[entity_name]}', entity_name),  file.name.split('.')[0] + '.hbs'))
    }

    console.log(`Se ha destruido el ${file.type} ${file.name.split('.')[0]}`)
  })
  fs.rmdirSync(path.join(__dirname, '..', '..', 'client', 'views/partials/{[entity_name]}/'.replace('{[entity_name]}', entity_name)))

  // Elimina la ruta en el server app
  var app = fs.readFileSync( path.join(__dirname, '..', '..', 'app.js'), 'utf8')
  app = app.replace(`app.use('/${entity_name}', require('./server/routes/${entity_name}'))`, '')
  fs.writeFileSync( path.join(__dirname, '..', '..', 'app.js'), app)

  // Elimina el servicio en el client app
  var app = fs.readFileSync( path.join(__dirname, '..', '..', 'client', 'app.js'), 'utf8')
  app = app.replace(`require('./services/${entity_name}');`, '')
  fs.writeFileSync( path.join(__dirname, '..', '..', 'client', 'app.js'), app)
}

if (operation == 3) {
  console.log(`Limpiando client data`);
  fs.readdir(path.join(__dirname, '..', '..', 'client', 'data'), function (err, files) {
    files.forEach(function (file) {
      fs.unlinkSync(path.join(__dirname, '..', '..', 'client', 'data', file))
    });

    fs.readdir(path.join(__dirname, '..', 'data'), function (err, files) {
      files.forEach(function (file) {
        archivo = fs.readFileSync(path.join(__dirname, '..', 'data', file), 'utf8')
        fs.writeFileSync(path.join(__dirname, '..', '..', 'client', 'data', file), archivo)
        console.log(`Copiando ${file}`);
      });
    })
  })
}

if (operation == 4) {
  files.forEach(function (file) {
    var archivo = null;
    archivo = fs.readFileSync(path.join(__dirname, 'templates', file.type, file.name), 'utf8')
    archivo = archivo.split('{[entity_name]}').join(entity_name)
    archivo = archivo.split('{[perfil_id]}').join(perfil_id ? perfil_id : '1')

    var ext = file.type == 'client' ? '.js' : '.hbs'
    fs.writeFileSync(path.join(__dirname, '..', '..', 'client', file.output_folder, entity_name + ext), archivo)

    console.log(`Se ha generado el ${file.type} ${file.name.split('.')[0]}`)
  })

  // Agrega el servicio en el client app
  var app = fs.readFileSync( path.join(__dirname, '..', '..', 'client', 'app.js'), 'utf8')
  if (app.indexOf(`require('./controllers/${entity_name}');`) == -1) {
    app = app.replace('//<---- EOF ---->', 
`require('./controllers/${entity_name}');
//<---- EOF ---->`)
    fs.writeFileSync( path.join(__dirname, '..', '..', 'client', 'app.js'), app)
  }
}

if (operation == 5) {
  files.forEach(function (file) {

    if (file.type == 'client') {
      fs.unlinkSync(path.join(__dirname, '..', '..', 'client', file.output_folder, entity_name + '.js'))
    }

    if (file.type == 'views') {
      fs.unlinkSync(path.join(__dirname, '..', '..', 'client', file.output_folder, entity_name + '.hbs'))
    }

    console.log(`Se ha destruido el ${file.type} ${file.name.split('.')[0]}`)
  })
}
