const { Router } = require('express');
const {check} = require('express-validator');

// controllers
const { getClientes, 
        postCliente, 
        getCliente, 
        pathCliente, 
        deleteCliente } = require('../controllers/clientes');
        
const { validarClienteById, validarDpi } = require('../helpers');
// const { validarCliente } = require('../helpers/db-validators');

// middlewares
const { validarCampos, validarJWT } = require('../middlewares')

const router = Router();

// get todos los clientes
router.get('/', [
  validarJWT,
  validarCampos
], getClientes);

// crear un cliente
router.post('/', [
  validarJWT,
  check('dpi', 'El dpi es obligatorio').not().isEmpty(),
  check('alias', 'El alias es obligatorio').not().isEmpty(),
  check('telefono', 'El dpi es obligatorio').not().isEmpty(),
  check('nombre', 'El nombre es obligatorio').not().isEmpty().isLength({min: 4}),
  check('ciudad', 'La ciudad es obligatoria').not().isEmpty().isLength({min: 4}),
  check('direccion', 'La direccion es obligatoria').not().isEmpty().isLength({min: 4}),
  validarCampos
], postCliente);

// get un cliente por id
router.get('/:id', [
  validarJWT,
  check('id').custom(validarClienteById),
  validarCampos
], getCliente);

// actualizar un cliente
router.patch('/:id', [
  validarJWT,
  check('id').custom(validarClienteById),
  validarCampos
], pathCliente);

// eliminar un usuario
router.delete('/:id', [
  validarJWT,
  check('id').custom(validarClienteById),
  validarCampos
], deleteCliente);

module.exports = router;