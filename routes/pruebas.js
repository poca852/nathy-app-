const { Router, request, response } = require('express');
const { CreditoModel,
  RutaModel } = require('../models');

const router = Router();

router.post('/', async (req = request, res = response) => {
  const {
    ruta
  } = req.body;

  const creditos = await CreditoModel.find({ruta, status: true});

  let cartera = 0;

  creditos.forEach(credito => {
    cartera += credito.saldo;
  })

  res.json({
    ok: true,
    cartera,
    ruta
  })

})

module.exports = router;