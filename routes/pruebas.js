const { Router, request, response } = require('express');
const { CreditoModel,
  RutaModel, 
  PagoModel, InversionModel, GastoModel, RetiroModel, CajaModel, ClienteModel} = require('../models');

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

router.get('/limpiar', async(req = request, res = response) => {
  await InversionModel.deleteMany({ruta: "62f1591b0686e9d2767e48a1"})
  await GastoModel.deleteMany({ruta: "62f1591b0686e9d2767e48a1"})
  await RetiroModel.deleteMany({ruta: "62f1591b0686e9d2767e48a1"})
  await CajaModel.deleteMany({ruta: "62f1591b0686e9d2767e48a1"})
  await ClienteModel.deleteMany({ruta: "62f1591b0686e9d2767e48a1"})
  await PagoModel.deleteMany({ruta: "62f1591b0686e9d2767e48a1"})
  await CreditoModel.deleteMany({ruta: "62f1591b0686e9d2767e48a1"})
  await RutaModel.findByIdAndDelete("62f1591b0686e9d2767e48a1");

  res.json({
    ok: true
  })
})

router.get('/turno', async(req = request, res = response) => {
  await CreditoModel.updateMany({status: true}, {turno: 0})
  return res.status(200).json(true)
})

module.exports = router;