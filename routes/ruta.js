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
        addEmpleado} = require('../controllers/ruta');

// helpers
const { validarUsuarioById, 
        validarRutaByName, 
        validarRutaById } = require('../helpers/db-validators');

// middlewares
const { validarJWT, 
        validarCampos, 
        esSuperAdmin} = require('../middlewares/');

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
  check('empleado').custom(validarUsuarioById),
  validarCampos
], addEmpleado); 

router.patch('/close/:idRuta', [
  validarJWT,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], closeRuta);

router.patch('/open/:idRuta', [
  validarJWT,
  esSuperAdmin,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], openRuta);

router.put('/add-ruta-admin/:idAdmin/:idRuta', [
  validarJWT,
  esSuperAdmin,
  check('idAdmin', 'No es un id valido').isMongoId(),
  check('idAdmin').custom(validarUsuarioById),
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], addRutaAdmin)

module.exports = router;