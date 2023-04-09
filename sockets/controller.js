const { Socket } = require('socket.io');

const socketController = (socket = new Socket(), io) => {
  socket.on('cerrar-ruta', payload => {
    io.emit('se-cerro', payload)
  })

};

module.exports = {
  socketController
};