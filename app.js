const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use((req, res, next) => {
  req.io = io;

  return next();
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


require('./server/routes')(app);


server.listen(3001, () => {
  console.log('Server started on port 3001');
});
