Promise = require('bluebird');
helpers = require('../modules/helpers');

conn = null;

sql = require('mssql');

var fs = require('fs');
var sql_cred = JSON.parse(fs.readFileSync(__dirname + '/sql_cred', 'utf8'));

module.exports.start = function() {
   return new Promise(function(resolve, reject) {
    var p1 = new Promise(function(resolve, reject) {
      conn = new sql.Connection(sql_cred, function(err) {
        if(err) {
          reject(err);
        } else {
          resolve({conn: conn});
          console.log('mssql');
        }
      });
    });

    Promise.settle([p1]).then(function(results) {
      resolve({conn: conn});
    });
   });
}
