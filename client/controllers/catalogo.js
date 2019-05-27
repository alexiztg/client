require('../services/catalogo');

angular.module(MODULE_NAME)
.controller('catalogoCtrl', ['$scope', 'catalogoService', function($scope, catalogoService) {
    $scope.init = init
    $scope.mostrar= true

    $scope.datos = {
        nombre: '',
        ap: '',
        edad: '',
        correo: '',
        telefono: '',
        activo: ''
    }

    function btObtner (){
        catalogoService.obtenerUsuario()
        .success(function(res){
            $scope.datos_list = res.result 
            console.log(res)
        })
    }
    function init() {
        btObtner ()
    }

}]);
