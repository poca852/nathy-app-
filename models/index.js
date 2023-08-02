const User = require('./UsuarioMode');
const Ruta = require('./RutaModel');
const Cliente = require('./ClienteModel');
const Credito = require('./CreditoModel');
const Caja = require('./CajaModel');
const Pago = require('./PagoModel');
const Inversion = require('./InversionModel');
const Retiro = require('./RetiroModel');
const Gasto = require('./GastoModel');
const Rol = require('./rol');
const ListGasto = require('./gasto');
const Empresa = require('./EmpresaModel');

module.exports = {
  User,
  Ruta,
  Cliente,
  Credito,
  Caja,
  Pago,
  Inversion,
  Retiro,
  Gasto,
  Rol,
  ListGasto,
  Empresa
}