
const dataSeed = {
  user: {
    nombre: 'David Cuspoca',
    estado: true,
    username: 'poca',
    password: '229497',
    rol: 'ADMIN',
  },
  roles: ['admin', 'cobrador', 'super_admin'],
  ruta: {
    nombre: 'demo',
    ciudad: 'libertad',
    ingresar_gastos_cobrador: true
  },
  empleado: {
    nombre: 'natali soto',
    estado: true,
    username: 'nathy',
    password: '229497',
    rol: 'COBRADOR',
    ruta: 'DEMO'
  },
  gastos: ['recarga', 'moto', 'gasolina', 'medicina']
}

module.exports = dataSeed;