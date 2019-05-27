var express = require('express')
var redis = require('redis')
var expressSession = require('express-session')
var app = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var RedisStore = require('connect-redis')(expressSession)

var helpers = require('./server/modules/helpers')

var http = helpers.isProduccion() ? require('http') : require('https')
var fs = require('fs')

var server = null
var path = require('path')
var model = require('./server/models/main')

if (!helpers.isProduccion()) {
  console.log('Ambiente de pruebas')
  server = http.createServer({
    key: fs.readFileSync(path.join('server', 'assets', 'key.pem')),
    cert: fs.readFileSync(path.join('server', 'assets', 'cert.pem'))
  }, app)
} else {
  console.log('Ambiente de producción')
  server = require('http').createServer(app)
}

var client = redis.createClient()

var exphbs = require('express-handlebars')

global.puerto = '3034'
global.sistema = 'playground'
global.sistema_id = 32

var hbsHelpers = {
  ifCond: function (v1, operator, v2, options) {
    console.log(v1)
    console.log(operator)
    console.log(v2)

    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this)
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this)
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this)
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this)
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this)
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this)
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this)
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this)
      default:
        return options.inverse(this)
    }
  }
}

app.engine('.hbs', exphbs({
  layoutsDir: path.join(__dirname, 'client/views/layouts'),
  partialsDir: path.join(__dirname, 'client/views/partials'),
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: hbsHelpers
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'client', 'views'))

global.appRoot = path.resolve(__dirname)

app.use(bodyParser.json())
app.use(bodyParser())
app.use(cookieParser())
app.use(expressSession({
  secret: '68dsfba78fs78dsfs78dfasd7f',
  store: new RedisStore({host: '127.0.0.1', port: 6379, client: client}),
  saveUninitialized: false,
  resave: false
}
))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.removeHeader("X-Powered-By");
  next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.set('port', process.env.PORT || global.puerto)

app.use(function (req, res, next) {
  console.log('url', req.url)
  next()
})

io = require('socket.io').listen(server)
nsp = io.of('/' + global.sistema + '/')

// start the models
model.start()
.then(function () {
  app.start = app.listen = function () {
    console.log('Escuchando desde el puerto ' + global.puerto)
    return server.listen.apply(server, arguments)
  }

  app.start(app.get('port'))

  // sockets
  nsp.on('connection', function (socket) {
    socket.on('bla', function () {
      nsp.emit('blabla', {})
    })
  })

  var navRoute = require('./server/routes/nav')
  app.use('/', navRoute)
  
  
  var catalogoRoute = require('./server/routes/catalogo')
  app.use('/', catalogoRoute)
  
})//<---- EOF ---->