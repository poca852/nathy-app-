const {Router} = require('express');
const {check} = require('express-validator');
const { getCaja } = require('../controllers/caja');
const { validarRutaById } = require('../helpers');

const {validarJWT, validarCampos} = require('../middlewares/');

const router = Router();

// get caja
router.get('/:idRuta', [
  validarJWT,
  check('idRuta', 'No es un id valido').isMongoId(),
  check('idRuta').custom(validarRutaById),
  validarCampos
], getCaja)

module.exports = router;