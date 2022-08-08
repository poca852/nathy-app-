const {Router} = require('express');
const {check} = require('express-validator');
const { validarGastoByName, validarGastoById } = require('../helpers');

// middlewares
const {validarJWT, validarCampos} = require('../middlewares/');
const { esSuperAdmin } = require('../middlewares/validar-roles');

// helpers

// controllers
const { addGasto,
        getGastos,
        getGasto,
        putGasto,
        deleteGasto } = require('../controllers/listaGasto')

const router = Router();

router.post('/', [
  validarJWT,
  esSuperAdmin,
  check('gasto').not().isEmpty(),
  check('gasto').custom(validarGastoByName),
  validarCampos
], addGasto)

router.get('/', [
  validarJWT,
  // esSuperAdmin,
], getGastos)

router.get('/:id', [
  validarJWT,
  // esSuperAdmin,
  check('id').custom(validarGastoById),
  validarCampos
], getGasto)

router.put('/:id', [
  validarJWT,
  esSuperAdmin,
  check('id').custom(validarGastoById),
  validarCampos
], putGasto)

router.delete('/:id', [
  validarJWT,
  esSuperAdmin,
  check('id').custom(validarGastoById),
  validarCampos
], deleteGasto)

module.exports = router;