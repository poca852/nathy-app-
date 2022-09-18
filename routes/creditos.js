const { Router } = require('express');
const { check } = require('express-validator');
const { getCreditos,
        addCredito,
        getCreditoById,
        actualizarCredito,
        eliminarCredito } = require('../controllers/creditos');
        
const { validarClienteById, 
        validarCreditoById, 
        validarRutaById } = require('../helpers');

const { validarCampos, 
        validarJWT,
        esSuperAdmin } = require('../middlewares');

const router = Router();

// getCreditos
router.get('/', [
        validarJWT,
        validarCampos
], getCreditos);

// postCreditos
router.post('/:idCliente', [
        validarJWT,
        check('idCliente', 'No es un id valido').isMongoId(),
        check('idCliente').custom(validarClienteById),
        check('valor_credito', 'Monto Incorrecto').isNumeric(),
        check('interes', 'El interes debe ser un numero').isNumeric(),
        check('total_cuotas', 'El numero de cuotas debe ser un numero').isNumeric(),
        check('idRuta', 'no es un id valido').isMongoId(),
        check('idRuta').custom(validarRutaById),
        validarCampos
], addCredito);

// getCredito
router.get('/:idCredito', [
        validarJWT,
        check('idCredito', 'No es un id valido').isMongoId(),
        check('idCredito').custom(validarCreditoById),
        validarCampos
], getCreditoById);

// patchCredito
router.put('/:idCredito', [
        validarJWT,
        check('idCredito', 'No es un id valido').isMongoId(),
        check('idCredito').custom(validarCreditoById),
        check('idRuta', 'No es un id valido').isMongoId(),
        check('idRuta').custom(validarRutaById),
        validarCampos
], actualizarCredito);

// deleteCredito
router.delete('/:idCredito', [
        validarJWT,
        esSuperAdmin,
        check('idCredito', 'No es un id valido').isMongoId(),
        check('idCredito').custom(validarCreditoById),
        check('idRuta', 'No es un id valido').isMongoId(),
        check('idRuta').custom(validarRutaById),
        check('idCliente', 'No es un id valido').isMongoId(),
        check('idCliente').custom(validarClienteById),
        check('fecha', 'La fecha es obligatoria').not().isEmpty(),
        esSuperAdmin
], eliminarCredito);


module.exports = router;