const app = require('./app');

// Listen for requests
app.set('port', 3000);

var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Serving /dist on port ' + port);
});
