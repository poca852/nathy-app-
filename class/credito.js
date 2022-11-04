const {CreditoModel, RutaModel, ClienteModel} = require('../models');
const { updateCaja, updateRuta } = require('../helpers')

const getCredito = async({valor_credito, total_cuotas, fecha_inicio, valor_cuota, notas}, ruta, cliente) => {
  let interes = ((valor_cuota * total_cuotas) - valor_credito) / valor_credito;
  let saldo = valor_cuota * total_cuotas;
  let total_pagar = saldo;

  const credito = await CreditoModel.create({
    valor_credito,
    total_cuotas,
    fecha_inicio,
    valor_cuota,
    notas,
    interes,
    saldo,
    total_pagar,
    ruta,
    cliente
  })

  const clienteDb = await ClienteModel.findById(cliente);
  clienteDb.status = true;
  clienteDb.creditos.push(credito);
  await clienteDb.save()

  await updateCaja(ruta, fecha_inicio);
  await updateRuta(ruta);

  return credito;

}

module.exports = {
  getCredito
}