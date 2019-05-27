var urlusuario = helpers.getUrl();

angular.module(MODULE_NAME)
.service('catalogoService', ['$http', function($http) {

  var urlBase = urlusuario + '/catalogo';

  this.obtenerUsuario = function () {
    return $http.get(urlBase + "/obtener/usuario");
    
  };

}]);
