var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET map listing. */
router.get('/', function(req, res, next) {
  fs.readFile('views/content/map.html',function(error, data){
    if(error){
      console.log(error);
    } else {
      res.writeHead(200, {'Content-Type' : 'text/html'});
      res.end(data);
    }
  });
});

module.exports = router;
