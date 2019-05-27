var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if(req.session.usuario) {
		res.redirect('inicio');
	} else {
		res.render('index', {assets: helpers.assetsUrl(), pruebas: process.env.AMBIENTE_NODE == 'pruebas'});
	}
});

router.post('/', function(req, res) {
	var session = JSON.parse(req.body.session);
	req.session.usuario = session;
	if(req.session.usuario) {
		res.redirect('inicio');
	} else {
		res.render('index', {assets: helpers.assetsUrl(), pruebas: process.env.AMBIENTE_NODE == 'pruebas'});
	}
});

router.delete('/', function(req, res) {
	req.session.destroy(function () {
    req.session = null;
    res.clearCookie('connect.sid', { path: '/' });
    res.json({err: false});
  });
});

router.get('/inicio', helpers.isFirmado, function(req, res) {
	var perfil_id = helpers.buscarPerfilActual(req.session.usuario.perfiles, global.sistema_id);
	res.render('inicio', {logged: true, assets: helpers.assetsUrl(), url: helpers.url(), perfil_id: perfil_id, pruebas: process.env.AMBIENTE_NODE == 'pruebas'});
});

router.get('/empresas', helpers.isFirmado, function(req, res) {
	var perfil_id = helpers.buscarPerfilActual(req.session.usuario.perfiles, global.sistema_id);
	res.render('empresas', {logged: true, assets: helpers.assetsUrl(), url: helpers.url(), perfil_id: perfil_id, pruebas: process.env.AMBIENTE_NODE == 'pruebas'});
});

router.get('/catalogo', helpers.isFirmado, function(req, res) {
	var perfil_id = helpers.buscarPerfilActual(req.session.usuario.perfiles, global.sistema_id);
	res.render('catalogo', {logged: true, assets: helpers.assetsUrl(), url: helpers.url(), perfil_id: perfil_id, pruebas: process.env.AMBIENTE_NODE == 'pruebas'});
});
module.exports = router;
