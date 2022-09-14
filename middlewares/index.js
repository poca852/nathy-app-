const validaCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const { esSuperAdmin } = require('./validar-roles');

module.exports = {
  ...validaCampos,
  ...validarJWT,
  esSuperAdmin
}