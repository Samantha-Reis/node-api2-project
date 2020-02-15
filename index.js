const express = require('express');
const server = express();
const apiRouter = require('./api-router/api-router')

server.use(express.json());
server.use('/',apiRouter);



server.listen(3000, () => {
    console.log('\n*** Server Running on http://localhost:3000 ***\n');
  });