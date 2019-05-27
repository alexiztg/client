var angular = require('angular');
require('angular-utils-pagination');
require('angular-spinner');
require('angular-file-upload');
MODULE_NAME = 'gabssa-playground';

PUERTO = '3034';
SISTEMA = 'playground';
SISTEMA_ID = 32;


angular.module(MODULE_NAME, ['angularUtils.directives.dirPagination', 'angularSpinner', 'angularFileUpload'])
  .config(['$interpolateProvider', '$httpProvider', function($interpolateProvider, $httpProvider) {
	  $interpolateProvider.startSymbol('{[');
	  $interpolateProvider.endSymbol(']}');
    $httpProvider.defaults.withCredentials = true;
	}]);

//$ = require('jquery');
helpers = require('./helpers');
require('./services/socket');
require('./filters/string');
require('./filters/arrays');
require('./filters/number');
require('./directives/rome');
require('./controllers/user');
require('./controllers/catalogo');


//<---- EOF ---->

helpers.initInterfaz();
