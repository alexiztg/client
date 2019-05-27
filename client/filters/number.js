var _reduce = require('lodash.reduce');

angular.module(MODULE_NAME)
.filter('sumByKey', function() {
  return function(data, key) {
    if (typeof(data) ===  'undefined' || typeof(key) === 'undefined') {
      return 0;
    }

    suma = _reduce(data, function(sum, n) {
      return sum + parseFloat(n[key]);
    }, 0);
    return suma;

  };
});
