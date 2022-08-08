const {Router} = require('express');
const {check} = require('express-validator');
const { getPagos, 
        postPagos,
        getPago } = require('../controllers/pago');
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



module.exports = router;