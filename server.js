const { http } = require('./server/app');

http.listen(4000, function () {
    console.log('listening on *:4000');
});
