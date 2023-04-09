const { CreditoModel, PagoModel, ClienteModel } = require('../models');

const verificarEstadoCliente = async(idCliente) => {
  const cliente = await ClienteModel.findById(idCliente)
    .populate('creditos')

  if(cliente.creditos[0].saldo === 0){
    cliente.status = false;
    await cliente.save();
    return true;
  }else{
    cliente.status = true;
    await cliente.save();
  }
}

const actualizarCredito = async (id) => {

  try {
    const creditoDb = await CreditoModel.findById(id)
      .populate('pagos', 'valor fecha')

    // abonos
    let abonos = 0;
    creditoDb.pagos.forEach(({ valor }) => {
      abonos = abonos + valor;
    });
    creditoDb.abonos = abonos;

    // saldo
    creditoDb.saldo = creditoDb.total_pagar - abonos;

    // si el saldo es igual a cero damos por finalizado el credito
    if (creditoDb.saldo === 0) {
      creditoDb.status = false;
    }else{
      creditoDb.status = true;
    }

    // actualizamos el ultimo pago
    creditoDb.ultimo_pago = creditoDb.pagos[0].fecha.split(' ')[0];

    await creditoDb.save();

    await verificarEstadoCliente(creditoDb.cliente)
    return true;
  } catch (error) {
    throw new Error('no se pudo actualizar el pago')
  }
}

const agregarPago = async(idCredito, valor, fecha) => {
  const credito = await CreditoModel.findById(idCredito);
  if(!credito){
    throw new Error('No hay ningun credito con ese id')
  };

  if(valor > credito.saldo){
    throw new Error(`El saldo del cliente es inferiro al monto que desea ingresar, por favor revise su pago.`)
  }

  const newPago = new PagoModel({
    valor,
    fecha,
    cliente: credito.cliente,
    ruta: credito.ruta,
    credito: credito.id
  });
  
  await verificarEstadoCliente(credito.cliente);

  return true;

}

const actualizarPago = async(idCredito, valor, fecha, idPago) => {

  const [credito, pago] = await Promise.all([
    CreditoModel.findById(idCredito),
    PagoModel.findById(idPago)
  ])

  if(!credito){
    throw new Error('No hay ningun credito con ese id')
  };

  if(valor > credito.saldo + pago.valor){
    throw new Error(`El saldo del cliente es inferiro al monto que desea ingresar, por favor revise su pago.`)
  }

  pago.valor = valor;
  pago.fecha = fecha;
  
  await pago.save()
  await actualizarCredito(idCredito)

  return true;

}




module.exports = {actualizarCredito, agregarPago, actualizarPago, verificarEstadoCliente};