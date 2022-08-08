const {Router} = require('express');

const router = Router();

const {validarJWT} = require('../middlewares')

const buscar = require('../controllers/buscar');

router.get('/:coleccion/:termino', validarJWT, buscar)

module.exports = router;