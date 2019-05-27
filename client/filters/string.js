angular.module(MODULE_NAME)
.filter('capitalize', function() {
  return function(input) {
    //return input ? input.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); }) : undefined;
    return input ? ( (input ? input.toLowerCase() : input).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }) ) : undefined;
  };
});
