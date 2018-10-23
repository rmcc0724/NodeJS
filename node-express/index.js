// JavaScript Document
const express = require('express'), http = require('http');
const hostname = '0.0.0.0';
const port = 8080;
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');

app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promos', promoRouter);
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});
app.use(bodyParser.json());

const server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});