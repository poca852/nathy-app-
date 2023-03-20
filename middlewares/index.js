const validaCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const { esSuperAdmin } = require('./validar-roles');
const { isOpenRuta } = require('./validar-ruta-abierta')

module.exports = {
  ...validaCampos,
  ...validarJWT,
  esSuperAdmin,
  isOpenRuta
}