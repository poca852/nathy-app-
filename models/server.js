const express = require('express');
const cors = require('cors');
const connection = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port= process.env.PORT;

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
      pruebas: '/api/test'
    }

    // conectar a base de datos
    this.conectarDB();

    // middlewares
    this.middlewares();

    // rutas de mi aplicacion
    this.routes();
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
  }

  listen(){
    this.app.listen(this.port, () => {
      console.log('server online')
    })
  }
}

module.exports = Server;