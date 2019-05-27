require('../services/periodo');
var entity_name = require('../data/periodo').entity_name;
var Chart = require('chart.js');
var moment = require('moment');

angular.module(MODULE_NAME)
.controller(entity_name + 'Ctrl', ['$scope', '$filter', entity_name + 'Service', 'socket', function($scope, $filter, Service, socket) {

  $scope.data = require('../data/' + entity_name).data;
  $scope.entity_name = entity_name;

  /********************************************
  DIRECTORY - AGREGAR LA DEFINICION DE LAS FUNCIONES QUE SE IMPLEMENTEN EN 'FREE PLAYGROUND'
  ********************************************/

  $scope.initMenu = initMenu;

  $scope.btnGetAll = btnGetAll;
  $scope.btnGetReport = btnGetReport;

  $scope.btnSearch = btnSearch;

  $scope.isNewReady = isNewReady;
  $scope.btnSetNew = btnSetNew;

  $scope.btnUpdate = btnUpdate;
  $scope.isUpdateReady = isUpdateReady;
  $scope.btnSetUpdate = btnSetUpdate;

  $scope.isNewListReady = isNewListReady;
  $scope.btnSetNewList = btnSetNewList;

  $scope.loading = false;

  $scope.report = {};
  $scope.new = {};
  $scope.update = {};
  $scope.search = {};
  $scope.list = [];

  function initMenu() {
    btnGetAll();
  }

  function btnGetAll() {
    $scope.loading = true;
    Service.getAll()
    .success(function (result) {
      $scope.list = result;
      $scope.loading = false;
    });
  }

  function btnGetReport() {
    $scope.report = {};
    $scope.loading = true;
    Service.getReport()
    .success(function (res) {
      if (res.err) {
        $scope.report.err = res.description;
      } else {
        $scope.report.url = res.url;
      }
      $scope.loading = false;
    });
  }

  function btnSearch() {
    $scope.loading = true;
    var d = $scope.search;
    Service.getFind(d)
    .success(function (result) {
      $scope.list = result;
      $scope.loading = false;
    });
  }

  function isNewReady() {
    var d = $scope.new;
    return helpers.dataReady(d, $scope.data);
  }

  function btnSetNew() {
    var d = $scope.new;
    if(!$scope.loading) {
      $scope.loading = true;
      Service.setNew(d)
      .success(function (res) {
        if(res.err) {
          $scope.new.err = res.description;
        } else {
          $scope.list.push(d);
          delete $scope.new;
          $scope.new = {};
        }
        $scope.loading = false;
      })
    }
  }

  function btnUpdate(d) {
    $scope.update = d;
    d.show = true;
  }

  function isUpdateReady() {
    var d = $scope.update;
    var id = helpers.getIdName($scope.data);
    return d[id] && d[id] > 0;
  }

  function btnSetUpdate() {
    var d = $scope.update;
    if(!$scope.loading) {
      $scope.loading = true;
      Service.setUpdate(d)
      .success(function (res) {
        if(res.err) {
          $scope.update.err = res.description;
        } else {
          delete $scope.update;
          $scope.update = {};
        }
        $scope.loading = false;
      })
    }
  }

  function isNewListReady() {
    var f = $('input[type=file]')[0].files;
		var a = f.length > 0 ? f[0].name.split('.'):[];
		return f.length > 0 && a[a.length - 1] == 'xlsx';
  }

  function btnSetNewList() {

		if(!$scope.cargado) {
			$scope.cargado = true;

			if($('input[type=file]')[0].files[0] != null) {

				var data = new FormData();
				data.append('archivo', $('input[type=file]')[0].files[0]);
        data.append('programar', $scope.nueva_carga.programar);
        data.append('fecha_envio', $scope.nueva_carga.fecha_envio);

				var url = helpers.getUrl() + "/carga";

				var xhr = new XMLHttpRequest();

		    xhr.open('post', url, true);

		    xhr.upload.onprogress = function(e) {
		      if (e.lengthComputable) {
		        var percentage = (e.loaded / e.total) * 100;
						$('#progress-bar div.bar').html(parseInt(percentage) + "%");
		        $('#progress-bar div.bar').css('width', percentage + '%');
		      }
		    };

		    xhr.onerror = function(e) {

		    };

		    xhr.onreadystatechange = function() {
     			if (xhr.readyState==4 && xhr.status==200) {
						$('#archivo').val('');
     				$scope.$apply(function() {
     					var res = JSON.parse(xhr.responseText);
              $scope.cargado = false;
              var percentage = 0;
  						$('#progress-bar div.bar').html(parseInt(percentage) + "%");
  		        $('#progress-bar div.bar').css('width', percentage + '%');
     				});
					}
		    };

		    xhr.send(data);
			}
		}

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

  /********************************************
  FREE PLAYGROUND - A PARTIR DE AQUI SE PUEDEN REALIZAR MODIFICARIONES PROPIAS DE LA APLICACIÓN
  ********************************************/



}]);
