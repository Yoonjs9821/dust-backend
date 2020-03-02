var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET oauth listing. */
router.get('/', function(req, res, next) {
  fs.readFile('views/oauth.html',function(error, data){
    if(error){
      console.log(error);
    } else {
      res.writeHead(200, {'Content-Type' : 'text/html'});
      res.end(data);
    }
  });
});

module.exports = router;
