const { Router } = require('express');
const { check } = require('express-validator');

const { addInversion, 
        getInversiones, 
        getInversionById,
        actualizarInversion, 
        eliminarInversion } = require('../controllers/inversiones');

const { validarExisteInversionById, 
        validarRutaById } = require('../helpers/db-validators');

const { validarJWT, 
        validarCampos} = require('../middlewares/')

const router = Router();

// agregar inversion
router.post('/', [
  validarJWT,
  check('valor', 'No es un valor valido').isNumeric(),
  validarCampos
], addInversion);

// get inversion por id
router.get('/:idInversion', [
  validarJWT,
  check('idInversion', 'No es un id valido').isMongoId(),
  check('idInversion').custom(validarExisteInversionById),
  validarCampos
], getInversionById);

// get inversiones por una ruta determinada
router.get('/:idRuta', [
  validarJWT,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getInversiones)

// actualizar una inversion
router.put('/:idInversion', [
  validarJWT,
  check('idInversion', 'No es un id valido').isMongoId(),
  check('idInversion').custom(validarExisteInversionById),
  validarCampos
], actualizarInversion)

// eliminar una inversion
router.delete('/:idInversion', [
  validarJWT,
  check('idInversion', 'No es un id valido').isMongoId(),
  check('idInversion').custom(validarExisteInversionById),
  validarCampos
], eliminarInversion)

module.exports = router;