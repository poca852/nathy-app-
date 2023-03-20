const { Router, request, response } = require('express');
const { CreditoModel,
  RutaModel, 
  PagoModel} = require('../models');

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

router.get('/cobrado', async(req = request, res = response) => {
  const {ruta} = req.body;

  const pagos = await PagoModel.find({ruta, fecha: new RegExp('07/11/2022', 'i')})

  let cobroReal = 0;

  pagos.forEach(pago => {
    cobroReal += pago.valor;
  })

  res.json({
    msg: 'prueba',
    cobroReal
  })
})

router.get('/turno', async(req = request, res = response) => {
  await CreditoModel.updateMany({status: true}, {turno: 0})
  return res.status(200).json(true)
})

module.exports = router;