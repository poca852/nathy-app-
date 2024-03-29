const {Router} = require('express');
const {check} = require('express-validator');

// controladores de ruta
const { getRutaById, 
        actualizarRuta, 
        closeRuta, 
        openRuta, 
        getRutas, 
        addRutaAdmin, 
        addRuta, 
        addEmpleado,
        deleteRuta,
        closeRutaAdmin} = require('../controllers/ruta');

// helpers
const { validarUsuarioById, 
        validarRutaByName, 
        validarRutaById } = require('../helpers/db-validators');

// middlewares
const { validarJWT, 
        validarCampos, 
        esSuperAdmin} = require('../middlewares/');
const { tieneRol } = require('../middlewares/validar-roles');

const router = Router();

router.post('/', [
  validarJWT,
  esSuperAdmin,
  check('nombre', 'No es un numbre valido').isLength({min: 4}),
  check('nombre').custom(validarRutaByName),
  validarCampos
], addRuta);

router.get('/', [
  validarJWT,
], getRutas)

router.get('/:idRuta', [
  validarJWT,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getRutaById);

router.put('/:idRuta', [
  validarJWT,
  esSuperAdmin,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], actualizarRuta); 

router.put('/add-empleado/:idRuta', [
  validarJWT,
  esSuperAdmin,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  check('idEmpleado').custom(validarUsuarioById),
  validarCampos
], addEmpleado); 

// esta es para el cobrador
router.put('/close/:idRuta', [
  validarJWT,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  check('fecha').not().isEmpty(),
  validarCampos
], closeRuta);

router.put('/admin/close/:id', [
  validarJWT,
  check('id', 'No es un id valido').isMongoId(),
  validarCampos
], closeRutaAdmin)

router.put('/open/:idRuta', [
  validarJWT,
  esSuperAdmin,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  check('fecha').not().isEmpty(),
  validarCampos
], openRuta);

router.put('/add-ruta-admin/:idRuta', [
  validarJWT,
  esSuperAdmin,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  check('idAdmin', 'No es un id valido').isMongoId(),
  check('idAdmin').custom(validarUsuarioById),
  validarCampos
], addRutaAdmin)

router.delete('/delete/:idRuta', [
  validarJWT,
  esSuperAdmin,
  check('idRuta', 'no es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], deleteRuta)

module.exports = router;