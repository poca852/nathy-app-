const express = require('express');
const cors = require('cors');
const connection = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
  constructor() {
    this.app = express();
    this.port= process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server, {
      cors: {
        origin: 'http://localhost:4200',
        origin: 'https://www.nathyapp.live'
      }
    })

    // rutas de mi api
    this.paths = {
      auth: '/api/auth',
      admin: '/api/admin',
      usuarios: '/api/usuarios',
      clientes: '/api/clientes',
      creditos: '/api/creditos',
      pagos: '/api/pagos',
      caja: '/api/caja',
      inversion: '/api/inversiones',
      gastos: '/api/gastos',
      lista_gastos: '/api/lista-gastos',
      retiros: '/api/retiros',
      ruta: '/api/rutas',
      roles: '/api/roles',
      buscar: '/api/buscar',
      pruebas: '/api/test',
      seed: '/api/seed'
    }

    // middlewares
    this.middlewares();

    // conectar a base de datos
    this.conectarDB();

    // rutas de mi aplicacion
    this.routes();
    
    this.sockets();
  }

  async conectarDB() {
    try {
      await connection()
    } catch (error) {
      console.log(error);
    }
  }

  middlewares(){
    // cors
    this.app.use(cors());

    // lectura y parseo del body
    this.app.use(express.json());

    // directorio publico
    this.app.use(express.static('public'));
  }

  routes(){
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.admin, require('../routes/admin'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    this.app.use(this.paths.ruta, require('../routes/ruta'));
    this.app.use(this.paths.clientes, require('../routes/cliente'));
    this.app.use(this.paths.creditos, require('../routes/creditos'));
    this.app.use(this.paths.caja, require('../routes/caja'));
    this.app.use(this.paths.gastos, require('../routes/gastos'));
    this.app.use(this.paths.retiros, require('../routes/retiros'));
    this.app.use(this.paths.inversion, require('../routes/inversion'));
    this.app.use(this.paths.pagos, require('../routes/pago'));
    this.app.use(this.paths.roles, require('../routes/rol'));
    this.app.use(this.paths.lista_gastos, require('../routes/listaGasto'));
    this.app.use(this.paths.buscar, require('../routes/buscar'));
    this.app.use(this.paths.pruebas, require('../routes/pruebas'));
    this.app.use(this.paths.seed, require('../routes/seed'));
  }

  sockets() {
    this.io.on('connection', ( socket ) => socketController(socket, this.io ) )
  }

  listen(){
    this.server.listen(this.port, () => {
      console.log('server online')
    })
  }
}

module.exports = Server;