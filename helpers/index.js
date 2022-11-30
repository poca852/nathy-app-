const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const actualizarCaja = require('./update-caja');
const actualizarRuta = require('./update-ruta');

module.exports = {
  ...dbValidators,
  ...generarJWT,
  actualizarCaja,
  actualizarRuta
}