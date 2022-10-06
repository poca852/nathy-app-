const { Router } = require('express');
const { check } = require('express-validator');
const { getAllEmpleados, getRutas, deleteEmpleado } = require('../controllers/admin');
const { validarUsuarioById } = require('../helpers');
const { validarJWT, validarCampos, esSuperAdmin } = require('../middlewares');

const router = Router();

router.get('/empleados', [
  validarJWT,
  esSuperAdmin,
  validarCampos
], getAllEmpleados)

router.delete('/empleados/delete/:idEmpleado', [
  validarJWT,
  esSuperAdmin,
  check('idEmpleado', 'no es id valido').isMongoId(),
  check('idEmpleado').custom(validarUsuarioById),
  validarCampos
], deleteEmpleado)

router.get('/rutas', [
  validarJWT,
  esSuperAdmin,
  validarCampos
], getRutas)

module.exports = router;
