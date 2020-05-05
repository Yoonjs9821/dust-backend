module.exports = function(io) {
    io.on('connection', function(socket){
        socket.on('client message', function(data){
            console.log(data);
            io.emit('server message', data.message);
        });
    });
};