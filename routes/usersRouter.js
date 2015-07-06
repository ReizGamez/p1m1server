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
  }, res);
});

module.exports = router;
