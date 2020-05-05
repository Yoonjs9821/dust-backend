var express = require('express');
var router = express.Router();

router.get('/main', function(req,res){
    res.render('chat/main');
});

router.get('/room', function(req,res){
    console.log(req.ip);
    res.render('chat/room');
});

module.exports = router;