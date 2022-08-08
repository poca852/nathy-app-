const { Router } = require('express');
const { check } = require('express-validator');
const { getCreditos,
        postCredito,
        getCredito,
        patchCredito,
        deleteCredito } = require('../controllers/creditos');
        
const { validarClienteById, validarCreditoById, validarRutaById } = require('../helpers');

const { validarCampos, validarJWT } = require('../middlewares');
const { esSuperAdmin } = require('../middlewares/validar-roles');

const router = Router();

// getCreditos
router.get('/', [
        validarJWT,
        // check('idRuta', 'no es un id valido').isMongoId(),
        // check('idRuta').custom(validarRutaById),
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
        validarCampos
], postCredito);

// getCredito
router.get('/:id', [
        validarJWT,
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(validarCreditoById),
        validarCampos
], getCredito);

// patchCredito
router.patch('/:id', [
        validarJWT,
        esSuperAdmin
], patchCredito);

// deleteCredito
router.delete('/:id', [
        validarJWT,
        esSuperAdmin
], deleteCredito);


module.exports = router;