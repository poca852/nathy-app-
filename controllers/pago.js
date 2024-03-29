const { request, response } = require("express");
const { CreditoModel, 
        ClienteModel, 
        PagoModel, 
        RutaModel, 
        CajaModel } = require('../models');

const moment = require('moment');
const { calcularExtra } = require("../helpers/caja");
const { actualizarRuta, actualizarCaja } = require("../helpers");
const { actualizarCredito, actualizarPago, agregarPago } = require("../class/updateCredito");
moment.tz.setDefault('America/Guatemala');

// getPagos
const getPagos = async (req = request, res = response) => {

  try {

    const { idCliente, idCredito } = req.params;
    // si me mandan el cliente es porque solo quieren los pagos de un cliente
    const pagos = await PagoModel.find({ cliente: idCliente, credito: idCredito })
      .populate('cliente')
      .populate('credito')

    return res.status(200).json({
      ok: true,
      pagos
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getPagosParaVerificados = async (req = request, res = response) => {

  try {

    const { idRuta } = req.params;
    const { fecha } = req.query;
    // si me mandan el cliente es porque solo quieren los pagos de un cliente
    const pagos = await PagoModel.find({ ruta: idRuta, fecha: new RegExp(fecha, 'i') })
      .populate('cliente')
      .populate('credito')


    return res.status(200).json({
      ok: true,
      pagos
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// postPago
const addPago = async (req = request, res = response) => {
  
  try {

    const { idCredito } = req.params;
    const { valor, fecha } = req.body;
    const {ruta} = req.usuario;
    const pago = await agregarPago(idCredito, valor, fecha);
    await actualizarRuta(ruta);
    await actualizarCaja(ruta, fecha.split(" ")[0]);

    return res.status(201).json({
      ok: true,
      pago
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: error.message
    })
  }
}


const getPagoById = async (req = request, res = response) => {

  
  try {
    
    const { idPago } = req.params;

    const pago = await PagoModel.findById(idPago)
      .populate('credito')
      .populate('cliente');

    return res.status(200).json({
      ok: true,
      pago
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const updatePago = async (req = request, res = response) => {
  try {

    const { idPago } = req.params;
    const { valor, fecha } = req.body;
    const { ruta } = req.usuario;

    const pagoDb = await PagoModel.findById(idPago)
      .populate('cliente')
      .populate('credito', 'id')

    // await actualizarPago(pagoDb.credito.id, valor, fecha, idPago);
    // await actualizarRuta(ruta);
    // await actualizarCaja(ruta, fecha.split(' ')[0]);

    await Promise.all([
      actualizarPago(pagoDb.credito.id, valor, fecha, idPago),
      actualizarRuta(ruta),
      actualizarCaja(ruta, fecha.split(' ')[0])
    ])

    return res.status(200).json({
      ok: true,
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: error.message
    })
  }
}

const eliminarPago = async( req = request, res = response ) => {
  try{
    const { idPago } = req.params;
    const { fecha, idRuta, idCredito } = req.body;

    const [ruta, pago, cajaActual, credito] = await Promise.all([
      RutaModel.findById(idRuta),
      PagoModel.findById(idPago),
      CajaModel.findOne({ruta: idRuta, fecha}),
      CreditoModel.findById(idCredito)
    ]);

    // regresar todo como esstaba
    ruta.total_cobrado -= pago.valor;
    if(credito.status === false){
      ruta.clientes_activos += 1
    }
    credito.saldo += pago.valor;
    credito.abonos -= pago.valor;
    credito.pagos = credito.pagos.filter(creditoPago => creditoPago !== idPago);

    if(credito.fecha_inicio === fecha){
      cajaActual.extra -= pago.valor;
    }else{
      cajaActual.cobro -= pago.valor;
    }

    cajaActual.caja_final -= pago.valor;

    if(credito.saldo > 0){
      credito.status = true;
      await ClienteModel.findByIdAndUpdate(credito.cliente, {status: true}, {new: true});
    }

    // eliminamos el pago
    await PagoModel.findByIdAndDelete(idPago);

    // guardamos los cambios en las demas rutas
    await ruta.save();
    await cajaActual.save();
    await credito.save();

    return res.status(200).json({
      ok: true,
      msg: `Pago eliminado correctamente`
    })

  }catch(err){
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}


// const pathPago = (req = request, res = response) => {}
// const deletePago = (req = request, res = response) => {}

module.exports = {
  getPagos,
  addPago,
  getPagoById,
  updatePago,
  eliminarPago,
  getPagosParaVerificados
}