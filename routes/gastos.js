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
  check('valor', 'El valor del gasto es obligatorio').isNumeric(),
  check('gasto').custom(validarGastoById),
  check('fecha', 'La fecha es obligatoria').not().isEmpty(),
  check('idRuta', 'no es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
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