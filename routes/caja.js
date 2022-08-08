const {Router} = require('express');
const {check} = require('express-validator');
const { getCaja } = require('../controllers/caja');

const {validarJWT, validarCampos} = require('../middlewares/');

const router = Router();

// get caja
router.get('/', [validarJWT], getCaja)

module.exports = router;