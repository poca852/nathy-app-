const {Router} = require('express');
const {check} = require('express-validator');

const { getRetiros, 
        addRetiro, 
        getRetiroById,
        actualizarRetiro,
        eliminarRetiro } = require('../controllers/retiros');

const { validarExisteRetiroById, validarRutaById } = require('../helpers/db-validators');

const { validarJWT, 
        validarCampos, 
        isOpenRuta} = require('../middlewares/');

const router = Router();


router.post('/', [
  validarJWT,
  isOpenRuta,
  check('valor', 'El valor es obligatorio').isNumeric(),
  check('fecha', 'La fecha es obligatoria').not().isEmpty(),
  validarCampos
], addRetiro);

router.get('/:idRuta', [
  validarJWT,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getRetiros);

router.get('/:idRetiro', [
  validarJWT,
  check('idRetiro', 'No es un id valido').isMongoId(),
  check('idRetiro').custom(validarExisteRetiroById),
  validarCampos
], getRetiroById);

router.put('/:idRetiro', [
  validarJWT,
  check('idRetiro', 'No es un id valido').isMongoId(),
  check('idRetiro').custom(validarExisteRetiroById),
  validarCampos
], actualizarRetiro);

router.delete('/:idRetiro', [
  validarJWT,
  check('idRetiro', 'No es un id valido').isMongoId(),
  check('idRetiro').custom(validarExisteRetiroById),
  validarCampos
], eliminarRetiro);

module.exports = router;