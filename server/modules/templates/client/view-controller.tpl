var Chart = require('chart.js');
var moment = require('moment');

angular.module(MODULE_NAME)
.controller('{[entity_name]}Ctrl', ['$scope', '$filter', 'socket', function($scope, $filter, socket) {

  /********************************************
  DIRECTORY - AGREGAR LA DEFINICION DE LAS FUNCIONES QUE SE IMPLEMENTEN EN 'FREE PLAYGROUND'
  ********************************************/

  $scope.init = init;

  function init() {
    //Código de inicio
  }

  socket.on('registros_procesar_total', function(d) {
    console.log('credito:registros_procesar_total');
    $scope.registros_total = d;
  });

  socket.on('registros_procesar_avance', function(d) {
    console.log('credito:registros_procesar_avance');
    $scope.registros_avance = d.fin;
    if($scope.registros_avance == $scope.registros_total) {
      $scope.mostrarGraficas();
    }
  });

}]);
