const {CreditoModel, RutaModel, ClienteModel} = require('../models');

const getCredito = async({valor_credito, total_cuotas, fecha_inicio, valor_cuota, notas}, ruta, cliente) => {
  let interes = (valor_cuota * total_cuotas) - valor_credito / valor_credito;
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
}

module.exports = {
  getCredito
}