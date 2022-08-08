const {Router} = require('express');
const {check} = require('express-validator');
const moment = require('moment');
const { postInversion, getInversion, getInversiones } = require('../controllers/inversiones');
const { validarExisteInversionById, validarRutaById } = require('../helpers/db-validators');
moment().format();

const {validarJWT, validarCampos} = require('../middlewares/')

const router = Router();

router.post('/', [
  validarJWT,
  check('valor', 'No es un valor valido').isNumeric(),
  validarCampos
], postInversion);

router.get('/:idInversion', [
  validarJWT,
  check('idInversion', 'No es un id valido').isMongoId(),
  check('idInversion').custom(validarExisteInversionById),
  validarCampos
], getInversion);

router.get('/:ruta', [
  validarJWT,
  check('ruta', 'NO es un id valido').isMongoId(),
  check('ruta').custom(validarRutaById),
  validarCampos
], getInversiones)

module.exports = router;