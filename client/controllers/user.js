require('../services/user');

angular.module(MODULE_NAME)
.controller('userCtrl', ['$scope', 'UserService', function($scope, UserService) {
  var ctrl = this;

  this.login = function() {
    window.location.href = helpers.getUrlAcceso() + (helpers.getProduccion() ? '/' : '/test/') + SISTEMA_ID;
  }

  this.logout = function() {
    UserService.logout()
      .success(function(result) {
        window.location.href = helpers.getUrl();
      });
  }

  this.getSesion = function() {
    UserService.getSesion()
    .success(function(result) {
      ctrl.nombre = result.nombre + ' ' + result.apellido_paterno;
      ctrl.no_empleado = result.usuario_id;
      ctrl.perfil = result.perfil;
      ctrl.perfil_id = helpers.buscarPerfilActual(result.perfiles, SISTEMA_ID);
      $scope.$root.$broadcast("sesion_lista", {perfil: $scope.perfil_id, no_empleado: ctrl.no_empleado, nombre: ctrl.nombre});
    });
  }

  $scope.$root.$on("cargando_ini", function (event, args) {
	   ctrl.cargando = true;
	});

  $scope.$root.$on("cargando_fin", function (event, args) {
    ctrl.cargando = false;
	});


}]);
