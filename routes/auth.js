const {Router} = require('express');
const {check} = require('express-validator');
const { login, renew, adminLogin } = require('../controllers/auth');

const { validarCampos, validarJWT } = require('../middlewares')

const router =Router();

router.post('/login', [
  check('username', 'El username es obligatorio').not().isEmpty(),
  check('password', 'El password es obligatorio').not().isEmpty(),
  validarCampos
], login)

router.post('/admin/login', [
  check('username', 'El username es obligatorio').not().isEmpty(),
  check('password', 'El password es obligatorio').not().isEmpty(),
  validarCampos
], adminLogin)

router.get('/revalidar', [
  validarJWT,
  validarCampos
], renew)

module.exports = router;