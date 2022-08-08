const { request, response } = require("express");
const {CreditoModel, ClienteModel, PagoModel, RutaModel} = require('../models');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

// getPagos
const getPagos = async(req = request, res = response) => {

  const {ruta} = req.usuario;
  const {cliente} = req.query;

  try {
    // para obtener los pagos de cierte credito
    const pagos = await PagoModel.find({cliente, ruta});

    res.status(200).json({
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
const postPagos = async(req = request, res = response) => {

  const { ruta } = req.usuario;
  const { valor } = req.body;
  const { idCredito } = req.params;

  try {
    
    const creditoModel = await CreditoModel.findById(idCredito)
      .populate('cliente', 'id')


    // verifico que el valor sea menor al saldo del credito 
    if(valor > creditoModel.saldo){
      return res.status(401).json({
        ok: false,
        msg: `El saldo del cliente es ${creditoModel.saldo}`
      })
    }
    
    // contrario si no es mayor entonces procesamos el pago
    const newPago = await PagoModel.create({
      valor,
      fecha: moment().format('DD/MM/YYYY hh:mm a'),
      ruta,
      credito: idCredito,
      cliente: creditoModel.cliente.id
    })

    // se agrega el pago al arreglo de pagos que tiene el credito y aparte de eso se hacen las operaciones en los campos de saldo y abonos
    creditoModel.pagos.unshift(newPago);
    creditoModel.ultimo_pago = moment().format('DD/MM/YYYY');
    creditoModel.abonos += valor;
    creditoModel.saldo -= valor;

    // si el saldo del credito despues de hacer el pago es 0 tenemos que cambiar el status del credito y del cliente
    if(creditoModel.saldo === 0){
      creditoModel.status = false;
      await ClienteModel.findByIdAndUpdate(creditoModel.cliente.id, {status: false})
    }

    // finalmente guardamos los cambios en credito
    await creditoModel.save();

    // actualizamos la ruta con el total_cobrado
    const rutaModel = await RutaModel.findById(ruta);
    rutaModel.total_cobrado += valor;
    await rutaModel.save();

    res.status(201).json({
      ok: true,
      pago: newPago
    });
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}


const getPago = async(req = request, res = response) => {

  const{id} = req.params;
  const {ruta} = req.usuario;

  try {

    const pago = await PagoModel.find({id, ruta});

    res.status({
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


// const pathPago = (req = request, res = response) => {}
// const deletePago = (req = request, res = response) => {}

module.exports = {
  getPagos,
  postPagos,
  getPago,
}