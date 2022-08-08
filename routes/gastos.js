const {Router} = require('express');
const {check} = require('express-validator');
const { getGastos, postGastos } = require('../controllers/gastos');
const { validarGastoById, validarRutaById } = require('../helpers/db-validators');

const {validarJWT, validarCampos} = require('../middlewares/');

const router = Router();

router.get('/:ruta', [
  validarJWT,
  validarCampos
], getGastos)

router.get('/:idGasto', [
  validarJWT,
  check('idGasto', 'no es un id valido').isMongoId(),
  check('idGasto').custom(validarGastoById),
  validarCampos
], getGastos)

router.post('/', [
  validarJWT,
  check('valor', 'el valor tiene que ser  un numero').isNumeric(),
  check('gasto').custom(validarGastoById),
  validarCampos
], postGastos)

module.exports = router;