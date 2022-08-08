const { Router } = require('express');
const { check } = require('express-validator');
// const path = require('path')
const router = Router();

// controladores de mis rutas
const { postUsuarios,
        getUsuarios,
        putUsuarios,
        deleteUsuarios,
        getUsuario } = require('../controllers/usuarios');

const { validarUsuarioById, validarUsuarioByUsername, validarExisteRolById } = require('../helpers');

const { validarCampos, validarJWT } = require('../middlewares');
const { esSuperAdmin } = require('../middlewares/validar-roles');

// post usuarios
router.post('/', [
        validarJWT,
        esSuperAdmin,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('username', 'El Username es obligatorio').not().isEmpty(),
        check('username').custom(validarUsuarioByUsername),
        check('password', "La contraseña debe contener 6 caracteres").not().isEmpty().isLength({ min: 6 }),
        check('rol').custom(validarExisteRolById),
        validarCampos
], postUsuarios);

// get usuarios
router.get('/', [
        validarJWT,
], getUsuarios);

// getUsuario
router.get('/:id', [
        validarJWT,
        check('id').custom(validarUsuarioById),
        validarCampos
], getUsuario)

// put usuarios
router.put('/:id', [
        validarJWT,
        esSuperAdmin,
        check('id').custom(validarUsuarioById),
        validarCampos
], putUsuarios);


// delete usuarios
router.delete('/:id', [
        validarJWT,
        esSuperAdmin,
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(validarUsuarioById),
        validarCampos
], deleteUsuarios);

// por defecto
// router.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public/index.html'))
// })


module.exports = router;