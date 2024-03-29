const { Router } = require('express');
const {check} = require('express-validator');

// controllers
const { getClientes, 
        addCliente, 
        getClienteById, 
        actualizarCliente, 
        eliminarCliente } = require('../controllers/clientes');
        
const { validarClienteById, validarDpi, validarRutaById } = require('../helpers');
// const { validarCliente } = require('../helpers/db-validators');

// middlewares
const { validarCampos, 
        validarJWT,
        isOpenRuta } = require('../middlewares')

const router = Router();



// crear un cliente
router.post('/', [
  validarJWT,
  isOpenRuta,
  check('dpi', 'El dpi es obligatorio').not().isEmpty(),
  check('alias', 'El alias es obligatorio').not().isEmpty(),
  check('telefono', 'El dpi es obligatorio').not().isEmpty(),
  check('nombre', 'El nombre es obligatorio').not().isEmpty().isLength({min: 4}),
  check('ciudad', 'La ciudad es obligatoria').not().isEmpty().isLength({min: 4}),
  check('direccion', 'La direccion es obligatoria').not().isEmpty().isLength({min: 4}),
  validarCampos
], addCliente);

// get todos los clientes
router.get('/:idRuta', [
  validarJWT,
  check('idRuta', 'no es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getClientes);

// get un cliente por id
router.get('/one/:idCliente', [
  validarJWT,
  check('idCliente', 'No es un id valido').isMongoId(),
  check('idCliente').custom(validarClienteById),
  validarCampos
], getClienteById);

// actualizar un cliente
router.patch('/:idCliente', [
  validarJWT,
  isOpenRuta,
  check('idCliente', 'No es un id valido').isMongoId(),
  check('idCliente').custom(validarClienteById),
  validarCampos
], actualizarCliente);

// eliminar un usuario
router.delete('/:idCliente', [
  validarJWT,
  check('idCliente', 'No es un id valido').isMongoId(),
  check('idCliente').custom(validarClienteById),

  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], eliminarCliente);

module.exports = router;