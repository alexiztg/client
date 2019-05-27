var entity_name = require('../data/periodo').entity_name;
var url = helpers.getUrl();

angular.module(MODULE_NAME)
.service(entity_name + 'Service', ['$http', function($http) {

  var urlBase = url + '/' + entity_name;

  this.getAll = function() {
    return $http.get(urlBase);
  }

  this.getView = function(view) {
    if (typeof view === 'string') {
      return $http.get(urlBase + '/vista/' + view);
    } else {
      return $http.post(urlBase + '/vista', view);
    }
  }

  this.getFind = function(query) {
    if (typeof query === 'string' && query.length > 0) {
      return $http.get(urlBase + '/buscar/' + query);
    } else {
      if (query == '') {
        query = {}
      }
      return $http.post(urlBase + '/buscar', query);
    }
  }

  this.getReport = function(query) {
    if (typeof query === 'string') {
      return $http.get(urlBase + '/reporte/' + query);
    } else {
      return $http.post(urlBase + '/reporte', query);
    }
  }

  this.getReportFind = function(query) {
    return $http.get(urlBase + '/reporte/buscar/' + query);
  }

  this.get = function(id) {
    return $http.get(urlBase + '/' + id);
  }

  this.setNew = function(d) {
    return $http.post(urlBase, d);
  }

  this.setUpdate = function(d) {
    return $http.put(urlBase, d);
  }

  /********************************************
  FREE PLAYGROUND - A PARTIR DE AQUI SE PUEDEN REALIZAR MODIFICARIONES PROPIAS DE LA APLICACIÓN
  ********************************************/

}]);
