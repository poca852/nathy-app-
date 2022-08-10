const {Router} = require('express');
const {check} = require('express-validator');
const { getPagos, 
        postPagos,
        getPago, 
        updatePago} = require('../controllers/pago');
const { validarCreditoById, validarClienteById, validarPago } = require('../helpers');
        
const {validarJWT, validarCampos} = require('../middlewares/');

const router = Router();

// getPagos
router.get('/', [
  validarJWT, 
], getPagos)

// postPagos
router.post('/:idCredito', [
  validarJWT,
  check('idCredito', 'No es un id valido').isMongoId(),
  check('idCredito').custom(validarCreditoById),
  check('valor', 'No es un valor valido').isNumeric(),
  validarCampos
], postPagos)

//getPago
router.get('/:id', [
  validarJWT, 
  check('id').custom(validarPago),
  validarCampos
], getPago)

// actualizar el pago
router.patch('/:idPago', [
  validarJWT,
  check('idPago', 'No es un id valido').isMongoId(),
  check('idPago').custom(validarPago),
  validarCampos
], updatePago)

module.exports = router;