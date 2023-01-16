const { Router } = require('express');
const { check } = require('express-validator');
const { getCreditos,
        addCredito,
        getCreditoById,
        actualizarCredito,
        eliminarCredito, 
        creditoManual,
        getCreditoByDate} = require('../controllers/creditos');
        
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

router.get('/search/date', validarJWT, getCreditoByDate)

// postCreditos
router.post('/:idCliente', [
        validarJWT,
        check('idCliente', 'No es un id valido').isMongoId(),
        check('idCliente').custom(validarClienteById),
        check('valor_credito', 'Monto Incorrecto').isNumeric(),
        check('interes', 'El interes debe ser un numero').isNumeric(),
        check('total_cuotas', 'El numero de cuotas debe ser un numero').isNumeric(),
        check('fecha_inicio', 'fecha obligatoria').not().isEmpty(),
        validarCampos
], addCredito);

router.post('/manual/:idCliente', [
        validarJWT,
        check('idCliente', 'No es un id valido').isMongoId(),
        check('idCliente').custom(validarClienteById),
        check('valor_credito', 'Monto Incorrecto').isNumeric(),
        check('valor_cuota', 'Monto Incorrecto').isNumeric(),
        // check('interes', 'El interes debe ser un numero').isNumeric(),
        check('total_cuotas', 'El numero de cuotas debe ser un numero').isNumeric(),
        check('fecha_inicio').not().isEmpty(),
        validarCampos
], creditoManual);

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
        validarCampos
], actualizarCredito);

// deleteCredito
router.delete('/:idCredito', [
        validarJWT,
        esSuperAdmin,
        check('idCredito', 'No es un id valido').isMongoId(),
        check('idCredito').custom(validarCreditoById),
        esSuperAdmin
], eliminarCredito);


module.exports = router;