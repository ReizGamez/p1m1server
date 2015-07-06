var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var dbconnect = require('../dbconnect.js');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(morgan('combined'));

router.post('/register', function(req, res, next){
  var userName = req.body.userName;
  var password = req.body.password;
  
});

module.exports = router;
