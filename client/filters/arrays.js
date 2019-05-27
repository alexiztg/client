var _uniqBy = require('lodash.uniqby');

angular.module(MODULE_NAME)
.filter('unique', function() {
  return function(input, key) {
    return _uniqBy(input, key);
  };
});
