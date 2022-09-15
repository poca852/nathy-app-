const {Router} = require('express');
const {check} = require('express-validator');

const { getGastos, 
        addGasto,
        getGastoById,
        actualizarGasto,
        eliminarGasto } = require('../controllers/gastos');

const { validarGastoById, 
        validarRutaById } = require('../helpers/db-validators');

const { validarJWT, validarCampos } = require('../middlewares/');

const router = Router();

router.get('/:idRuta', [
  validarJWT,
  check('idRuta', 'no es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getGastos)

router.get('/:idGasto', [
  validarJWT,
  check('idGasto', 'no es un id valido').isMongoId(),
  check('idGasto').custom(validarGastoById),
  validarCampos
], getGastoById)

router.post('/', [
  validarJWT,
  check('valor', 'el valor tiene que ser  un numero').isNumeric(),
  check('gasto').custom(validarGastoById),
  validarCampos
], addGasto)

router.put('/:idGasto', [
  validarJWT,
  check('idGasto', 'No es un id valido').isMongoId(),
  check('idGasto').custom(validarGastoById),
  validarCampos
], actualizarGasto)

router.delete('/:idGasto', [
  validarJWT,
  check('idGasto', 'No es un id valido').isMongoId(),
  check('idGasto').custom(validarGastoById),
  validarCampos
], eliminarGasto)

module.exports = router;