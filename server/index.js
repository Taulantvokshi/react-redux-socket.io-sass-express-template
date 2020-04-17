const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const PORT = 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/auth', require('./auth'));
// app.use('/api', require('./api'));

app.use(express.static(path.join(__dirname, '..', '/public')));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;

    next(err);
  } else {
    next();
  }
});

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const startListening = () => {
  const server = app.listen(PORT, () => {
    console.log(`Mixing it up on port ${PORT}`);
  });

  // set up our socket control center
  const io = socketIo(server);
  require('./socket')(io);
};

startListening();
