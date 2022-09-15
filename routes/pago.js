const { Router } = require('express');
const { check } = require('express-validator');

const { getPagos, 
        addPago,
        getPagoById, 
        updatePago,
        eliminarPago} = require('../controllers/pago');

const { validarCreditoById, 
        validarPago, 
        validarRutaById} = require('../helpers');
        
const { validarJWT, 
        validarCampos } = require('../middlewares/');

const router = Router();

// getPagos
router.get('/:idRuta', [
  validarJWT, 
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getPagos)

// addPago
router.post('/:idCredito', [
  validarJWT,
  check('idCredito', 'No es un id valido').isMongoId(),
  check('idCredito').custom(validarCreditoById),
  check('valor', 'No es un valor valido').isNumeric(),
  validarCampos
], addPago)

//getPago
router.get('/:idPago', [
  validarJWT, 
  check('idPago', 'No es un id valido').isMongoId(),
  check('idPago').custom(validarPago),
  validarCampos
], getPagoById)

// actualizar el pago
router.put('/:idPago', [
  validarJWT,
  check('idPago', 'No es un id valido').isMongoId(),
  check('idPago').custom(validarPago),
  validarCampos
], updatePago)

router.delete('/:idPago', [
  validarJWT,
  check('idPago', 'No es un id valido').isMongoId(),
  check('idPago').custom(validarPago),
  validarCampos
], eliminarPago)

module.exports = router;