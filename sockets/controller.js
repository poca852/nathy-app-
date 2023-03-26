

const socketController = (socket) => {
  console.log('cliente conectado', socket.id);
  // socket.on('connection', () => {
  //   console.log('cliente conectado')
  // })
};

module.exports = {
  socketController
};