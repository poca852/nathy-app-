const { Router } = require('express');
const { check } = require('express-validator');

const { getPagos, 
        addPago,
        getPagoById, 
        updatePago,
        eliminarPago,
        getPagosParaVerificados} = require('../controllers/pago');

const { validarCreditoById, 
        validarPago, 
        validarRutaById,
        validarClienteById} = require('../helpers');
        
const { validarJWT, 
        validarCampos } = require('../middlewares/');

const router = Router();

// getPagos
router.get('/getPagos/:idCliente/:idCredito', [
  validarJWT, 
  check('idCliente', 'No es un id valido').isMongoId(),
  check('idCliente').custom(validarClienteById),
  check('idCredito', 'No es un id valido').isMongoId(),
  check('idCredito').custom(validarCreditoById),
  validarCampos
], getPagos)

// para ver los clientes verificados
router.get('/verificados/:idRuta', [
  validarJWT, 
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getPagosParaVerificados)

// addPago
router.post('/:idCredito', [
  validarJWT,
  check('idCredito', 'No es un id valido').isMongoId(),
  check('idCredito').custom(validarCreditoById),
  check('valor', 'No es un valor valido').isNumeric(),
  validarCampos
], addPago)

//getPago
router.get('/one/:idPago', [
  validarJWT, 
  check('idPago', 'No es un id valido').isMongoId(),
  check('idPago').custom(validarPago),
  validarCampos
], getPagoById)

// actualizar el pago
router.put('/update/:idPago', [
  validarJWT,
  check('idPago', 'No es un id valido').isMongoId(),
  check('idPago').custom(validarPago),
  check('valor', 'El valor es obligatorio').isNumeric(),
  validarCampos
], updatePago)

router.delete('/:idPago', [
  validarJWT,
  check('idPago', 'No es un id valido').isMongoId(),
  check('idPago').custom(validarPago),
  validarCampos
], eliminarPago)

module.exports = router;