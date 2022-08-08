const validaCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');

module.exports = {
  ...validaCampos,
  ...validarJWT,
}