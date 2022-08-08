const {Router} = require('express');
const {check} = require('express-validator');

// middlewares
const {validarJWT, validarCampos} = require('../middlewares/');
const { esSuperAdmin } = require('../middlewares/validar-roles');

// helpers
const { validarExisteRol, validarExisteRolById } = require('../helpers');

// controllers
const { addRol, 
        getRoles, 
        getRol, 
        putRol, 
        deleteRol } = require('../controllers/rol');

const router = Router();

router.post('/', [
  validarJWT,
  esSuperAdmin,
  check('rol').not().isEmpty(),
  check('rol').custom(validarExisteRol),
  validarCampos
], addRol)

router.get('/', [
  validarJWT,
  // esSuperAdmin,
], getRoles)

router.get('/:id', [
  validarJWT,
  // esSuperAdmin,
  check('id').custom(validarExisteRolById),
  validarCampos
], getRol)

router.put('/:id', [
  validarJWT,
  esSuperAdmin,
  check('id').custom(validarExisteRolById),
  validarCampos
], putRol)

router.delete('/:id', [
  validarJWT,
  esSuperAdmin,
  check('id').custom(validarExisteRolById),
  validarCampos
], deleteRol)

module.exports = router;