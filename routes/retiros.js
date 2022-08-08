const {Router} = require('express');
const {check} = require('express-validator');
const { getRetiros, postRetiro } = require('../controllers/retiros');

const {validarJWT, validarCampos} = require('../middlewares/');

const router = Router();

router.get('/', [
  validarJWT,
], getRetiros);

router.post('/', [
  validarJWT,
  check('valor', 'no es un valor permitido').isNumeric(),
  validarCampos
], postRetiro);

module.exports = router;