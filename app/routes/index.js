var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET index listing. */
router.get('/', function(req, res, next) {
  fs.readFile('views/index.html',function(error, data){
    if(error){
      console.log(error);
    } else {
      res.writeHead(200, {'Content-Type' : 'text/html'});
      res.end(data);
    }
  });
});
// router.get('/', function(req,res){
//   res.render('index');
// });

module.exports = router;
