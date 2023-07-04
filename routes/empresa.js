const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esSuperAdmin } = require('../middlewares');
const { createEmpresa, findAll, findOne } = require('../controllers/empresa');

const router = Router();

router.post('/', [
   validarJWT,
   check('nombre', "El nombre es obligatorio").isString(),
   check('fecha_cobro', "La fecha de cobro es obligatoria").isNumeric(),
   validarCampos
 ], createEmpresa)

router.get('/', [
  validarJWT,
  validarCampos
], findAll)

router.get('/:id', [
  validarJWT,
  check('id', 'no es id valido').isMongoId(),
  validarCampos
], findOne)

module.exports = router;
