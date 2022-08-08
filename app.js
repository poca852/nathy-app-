require('dotenv').config();
const path = require('path');
const Server = require('./models/server');


const server = new Server();

server.listen();

server.app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'))
})