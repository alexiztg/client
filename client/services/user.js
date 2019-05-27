var urlusuario = helpers.getUrlAcceso();

angular.module(MODULE_NAME)
.service('UserService', ['$http', function($http) {

  var urlBase = urlusuario + '/usuario';

  this.logout = function () {
    if(!helpers.getProduccion())
      $http.delete(helpers.getUrl());
    return $http.delete(urlBase + "/logout");
  };

  this.getSesion = function () {
    return $http.get(urlBase + "/sesion/" + SISTEMA_ID);
  };

}]);
