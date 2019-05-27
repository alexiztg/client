var url = helpers.getUrl();

angular.module(MODULE_NAME)
.service('UtilsService', ['$http', function($http) {

  var urlBase = url + '/utils';

  this.getFecha = function() {
    return $http.get(urlBase + '/fecha');
  }

}]);
