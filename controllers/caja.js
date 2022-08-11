const { request, response } = require("express");
const {CajaModel} = require('../models');
const { getDataCaja, getCajaAyer } = require("../helpers/caja");
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

const getCaja = async(req = request, res = response) => {

  const { ruta } = req.usuario;
  const hoy = moment().format('DD/MM/YYYY');

  try {
    // verificar si ya existe una caja con la fecha dada
    const caja = await CajaModel.findOne({fecha: hoy, ruta});
    // me traigo todas las cajas para poder sacar la ultima caja
  
    let base = await getCajaAyer(ruta, hoy);
    let fecha = hoy;
    let pretendido = await getDataCaja(ruta, hoy, 'getPretendido');
    let cobro = await getDataCaja(ruta, hoy, 'getCobro');
    let prestamo = await getDataCaja(ruta, hoy, 'getPrestamos');
    let renovaciones = await getDataCaja(ruta, hoy, 'getRenovacionesHoy');
    let inversion = await getDataCaja(ruta, hoy, 'getInversiones');
    let gasto = await getDataCaja(ruta, hoy, 'getGastos');
    let total_clientes = await getDataCaja(ruta, hoy, 'countClientes');
    let clientes_pendientes = await getDataCaja(ruta, hoy, 'getClientesPendientes');
    let retiro = await getDataCaja(ruta, hoy, 'getRetiros');
    let caja_final = base + inversion + cobro - prestamo - gasto - retiro;

    // esta informacion se puede imprimir desde el front
    // let efectividad = Math.round( (cobro * 100) / pretendido);

    const data = {
      fecha, 
      pretendido, 
      cobro, 
      prestamo, 
      base, 
      caja_final, 
      total_clientes, 
      clientes_pendientes, 
      renovaciones, 
      inversion, 
      gasto, 
      retiro, 
      ruta,
    }

    if(!caja){
      const nuevaCaja = await CajaModel.create(data);
      return res.json({
        ok: true,
        caja: nuevaCaja
      })
    }

    const cajaActual = await CajaModel.findByIdAndUpdate(caja.id, data, {new: true})

    res.status(200).json({
      ok: true,
      caja: cajaActual
    })

  } catch (error) {

    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })

  }

}

module.exports = {
  // postCaja,
  getCaja
}