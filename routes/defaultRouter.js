var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var bodyParser = require('body-parser');

var guess = [];
var AI_given = ['1', '2', '3', '4'];

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(morgan('tiny'));

router.post('/', function(req, res, next){
  var number = req.body.number;
  var assessmentResult = controlNumber(number);
  res.status(200).send(assessmentResult);
});

module.exports = router;

var controlNumber = function(number) {
guess = number.toString().split('');

  var pc = 0;
  var nc = 0;

  var r = "";

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (guess[i] === AI_given[j]) {
        if (i === j) {
          pc++;
        } else {
          nc++;
        }

      }
    }

  }
  return r + "+" + pc + " , -" + nc;
};
