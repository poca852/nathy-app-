const {Router} = require('express');
const {check} = require('express-validator');
const { postRuta, getRuta, patchRuta, closeRuta, openRuta } = require('../controllers/ruta');

// helpers
const { validarUsuarioById, validarRutaByName, validarRutaById } = require('../helpers/db-validators');

// middlewares
const {validarJWT, validarCampos} = require('../middlewares/');
const { esSuperAdmin } = require('../middlewares/validar-roles');

const router = Router();

router.post('/', [
  validarJWT,
  esSuperAdmin,
  check('nombre', 'No es un numbre valido').isLength({min: 4}),
  check('nombre').custom(validarRutaByName),
  validarCampos
], postRuta);

router.get('/:idRuta', [
  validarJWT,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getRuta);

router.patch('/add-employee/:idRuta/:idCobrador', [
  validarJWT,
  esSuperAdmin,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  check('idCobrador', 'No es un id valido').isMongoId(),
  check('idCobrador').custom(validarUsuarioById),
  validarCampos
], patchRuta); 

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

module.exports = router;