const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const updateCaja = require('./update-caja');
const updateRuta = require('./update-ruta');

module.exports = {
  ...dbValidators,
  ...generarJWT,
  updateCaja,
  updateRuta
}