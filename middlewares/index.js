const validaCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const isOpenRuta = require('./validar-isOpenRuta');
const { esSuperAdmin } = require('./validar-roles');


module.exports = {
  ...validaCampos,
  ...validarJWT,
  isOpenRuta,
  esSuperAdmin,
}