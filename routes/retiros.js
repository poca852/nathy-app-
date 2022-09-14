const {Router} = require('express');
const {check} = require('express-validator');

// controllers 
const { getRetiros, 
        addRetiro, 
        getRetiroById, 
        actualizarRetiro, 
        eliminarRetiro } = require('../controllers/retiros');

// middlewares
const { validarJWT, 
        validarCampos } = require('../middlewares/');

const { validarExisteRetiroPorId, validarRutaById } = require('../helpers')

const router = Router();


router.post('/', [
  validarJWT,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  check('valor', 'no es un valor permitido').isNumeric(),
  check('fecha', 'Fecha obligatoria').not().isEmpty(),
  validarCampos
], addRetiro);

// esta ruta es para obtener todos los retiros de una ruta en particular
router.get('/:idRuta', [
  validarJWT,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getRetiros);

router.get('/:idRetiro', [
  validarJWT,
  check('idRetiro', 'No es un id valido').isMongoId(),
  check('idRetiro').custom(validarExisteRetiroPorId),
  validarCampos
], getRetiroById);

router.put('/:idRetiro', [
  validarJWT,
  check('idRetiro', 'No es un id valido').isMongoId(),
  check('idRetiro').custom(validarExisteRetiroPorId),
  validarCampos
], actualizarRetiro);

router.delete('/:idRetiro', [
  validarJWT,
  check('idRetiro', 'No es un id valido').isMongoId(),
  check('idRetiro').custom(validarExisteRetiroPorId),
  validarCampos
], eliminarRetiro);

module.exports = router;