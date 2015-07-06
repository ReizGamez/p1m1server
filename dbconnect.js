var couchbase = require('couchbase');

var config = {
    connstr : 'http://localhost:8091'
};

var myCluster = new couchbase.Cluster(config.connstr);
var viewQuery = couchbase.ViewQuery;

function queryConstructor (bucketName, viewName){
  return viewQuery.from(bucketName, viewName);
}

function queryExecuter (input, error, callback){
  var constructedQuery = queryConstructor(input.document, input.view);
  if(input.viewKey){
    constructedQuery = constructedQuery.key(input.viewKey);
  }
  input.bucket.query(constructedQuery, function(dbError, results) {
    if(dbError) {
      error(dbError);
      return;
    }
    callback(results);
  });
}

function insert (input, error, complete){
  input.bucket.insert(input.bucketKey.toString(), input.value, function(dbError, dbResponse) {
    if (dbError) {
      error(dbError, input.bucketKey);
      return;
    }
    complete(input.bucketKey);
    return;
  });
}

function dbDelete (input, error, complete){
  input.bucket.remove(input.bucketKey.toString(), function(dbError, dbResponse) {
    if(dbError){
      error(dbError, input.bucketKey);
      return;
    }
    complete(input.bucketKey);
    return;
  });
}

module.exports = {
  dbInsert : insert,

  dbQuery : queryExecuter,

  dbInsertOrUpdate : function (input, error, complete) {
    queryExecuter(input, function(results){
      if(results && results.length == 1){
        input.bucket.replace(input.bucketKey.toString(), input.value, function(dbError, dbResponse){
          if (dbError) {
            error(dbError, key);
            return;
          }

          complete(input.bucketKey, input.value);
          return;
        });
      } else {
        insert(input);
      }
    });
  },

  dbDelete : dbDelete,

  cluster : myCluster
};
