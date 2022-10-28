const { RutaModel, 
        CreditoModel, 
        GastoModel,
        InversionModel,
        RetiroModel } = require('../models')

const actualizarRuta = async(ruta) => {
  if(!ruta) throw new Error('La ruta es obligatoria')

  let total_prestado = 0;
  let cartera = 0;
  let clientes_activos = 0;
  let total_cobrado = 0;
  let gastos = 0;
  let inversiones = 0;
  let retiros = 0;

  const [clientes, clientesActivos, gastoModel, inversionModel, retiroModel] = await Promise.all([
    CreditoModel.find({ruta}),
    CreditoModel.find({ruta, status: true}),
    GastoModel.find({ruta}),
    InversionModel.find({ruta}),
    RetiroModel.find({ruta})
  ]);

  clientes.forEach(credito => {
    total_prestado += credito.valor_credito;
    total_cobrado += credito.abonos;
  })

  clientesActivos.forEach(credito => {
    cartera += credito.saldo;
    clientes_activos += 1;
  })

  gastoModel.forEach(gasto => {
    gastos += gasto.valor;
  })

  inversionModel.forEach(inversion => {
    inversiones += inversion.valor;
  })

  retiroModel.forEach(retiro => {
    retiros += retiro.valor
  })

  await RutaModel.findByIdAndUpdate(ruta, {
    total_prestado, 
    cartera, 
    clientes_activos, 
    total_cobrado,
    gastos,
    inversiones,
    retiros
  })

  return true;

}

module.exports = actualizarRuta;