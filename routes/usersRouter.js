var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var dbconnect = require('../dbconnect.js');
var dbbucket = dbconnect.cluster.openBucket('users');
var dbdocument = 'usersDoc';
var dbview = 'by_username';

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(morgan('combined'));

router.post('/register', function(req, res, next){
  var userName = req.body.userName;
  var password = req.body.password;
  var input = {
    'bucket' : dbbucket,
    'document' : dbdocument,
    'view' : dbview,
    'viewKey' : userName,
    'bucketKey' : userName,
    'value' : {
      'userName' : userName,
      'password' : password
    }
  };
  dbconnect.dbInsert(input, function(dbError, bucketKey){
    res.status(400).send(dbError + ' Key: ' + bucketKey);
  }, function(bucketKey){
    res.status(200).send('Key successfully inserted: ' + bucketKey);
  });
});

router.post('/login', function(req, res, next){
  var userName = req.body.userName;
  var password = req.body.password;
  var input = {
    'bucket' : dbbucket,
    'document' : dbdocument,
    'view' : dbview,
    'viewKey' : userName,
    'bucketKey' : userName,
    'value' : {
      'userName' : userName,
      'password' : password
    }
  };
  dbconnect.dbQuery(input, function(dbError){
    res.status(400).send('Login failed for the username: ' + userName);
  }, function(results) {
    if(results && results.length === 1){
      if(results[0].value.password === password){
        res.status(200).send('Login successful!');
      } else {
        res.status(400).send('Wrong username or password');
      }
    } else {
      res.status(400).send('Wrong username or password');
    }
  });
});

module.exports = router;
