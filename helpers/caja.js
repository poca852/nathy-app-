const { CreditoModel, PagoModel, InversionModel, GastoModel, RetiroModel, CajaModel} = require('../models')

const getDataCaja = async(ruta = '', fecha = '', doc = '') => {
  switch (doc) {
    case 'getPretendido':
      let CreditoModelValue = 0;
      const creditos = await CreditoModel.find({status: true, ruta});
      creditos.forEach(credito => {
        CreditoModelValue += credito.valor_cuota;
      });

      return CreditoModelValue

    case 'getCobro':
      let PagoModelValue = 0;
      const pagos = await PagoModel.find({fecha: new RegExp(fecha, 'i'), ruta});
      pagos.forEach(pago => {
        PagoModelValue += pago.valor;
      });

      return PagoModelValue

    case 'getPrestamos':
      let getPrestamosValue = 0;
      const prestamos = await CreditoModel.find({fecha_inicio: new RegExp(fecha, 'i'), ruta});
      prestamos.forEach(credito => {
        getPrestamosValue += credito.valor_credito;
      });

      return getPrestamosValue

    case 'getRenovacionesHoy':
      return await CreditoModel.countDocuments({fecha_inicio: new RegExp(fecha, 'i'), ruta});

    case 'getInversiones':
      let getInversionesValue = 0;
      const inversiones = await InversionModel.find({fecha: new RegExp(fecha, 'i'), ruta});
      inversiones.forEach(inversion => {
        getInversionesValue += inversion.valor;
      });

      return getInversionesValue

    case 'getGastos':
      let getGastosValue = 0;
      const gastos = await GastoModel.find({fecha: new RegExp(fecha, 'i'), ruta});
      gastos.forEach(gasto => {
        getGastosValue += gasto.valor;
      });

      return getGastosValue

    case 'countClientes':
      return await CreditoModel.countDocuments({status: true, ruta});

    case 'getClientesPendientes':
      const numero_creditos = await CreditoModel.countDocuments({ status: true, ruta });
      const numero_pagos = await PagoModel.countDocuments({ fecha: new RegExp(fecha, 'i'), ruta });

      return numero_creditos - numero_pagos;

    case 'getRetiros':
      let getRetirosValue = 0
      const retiros = await RetiroModel.find({ fecha: new RegExp(fecha, 'i'), ruta });
      retiros.forEach(retiro => {
        getRetirosValue += retiro.valor
      })
      return getRetirosValue;
  
    default:
      break;
  }
}

const getCajaAyer = async(ruta, fecha) => {
  let base = 0
  const cajas = await CajaModel.find({ruta});
  const cajaActual = cajas.filter(caja => caja.fecha === fecha);
  if(cajaActual.length === 1){
    base = cajaActual[0].base;
    return base;
  }

  if(cajas.length === 1){
    base = cajas[0].caja_final;
    return base;
  }else if(cajas.length === 0){
    base = 0
    return base;
  }else if(cajas.length > 1){
    base = cajas[cajas.length - 2];
    return base;
  }

}

module.exports = {
  getDataCaja,
  getCajaAyer
}