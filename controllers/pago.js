const { request, response } = require("express");
const { CreditoModel, ClienteModel, PagoModel, RutaModel } = require('../models');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

// getPagos
const getPagos = async (req = request, res = response) => {

  const { ruta } = req.usuario;
  const { cliente, fecha } = req.query;

  try {

    // si me mandan el cliente es porque solo quieren los pagos de un cliente
    if (cliente) {
      // para obtener los pagos de cierte credito
      const pagos = await PagoModel.find({ cliente, ruta });

      return res.status(200).json({
        ok: true,
        pagos
      })
    }

    // si me mandan la fecha es porque quieren los pagos de una fecha determinada
    if (fecha) {
      const pagos = await PagoModel.find({ fecha: new RegExp(fecha, 'i'), ruta })
        .populate('credito')
        .populate('cliente')

      return res.status(200).json({
        ok: true,
        pagos
      })
    }


    const pagos = await PagoModel.find({ ruta })
      .populate('credito')
      .populate('cliente')

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
const postPagos = async (req = request, res = response) => {

  const { ruta } = req.usuario;
  const { valor } = req.body;
  const { idCredito } = req.params;

  try {

    const creditoModel = await CreditoModel.findById(idCredito)
      .populate('cliente', 'id')


    // verifico que el valor sea menor al saldo del credito 
    if (valor > creditoModel.saldo) {
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
    if (creditoModel.saldo === 0) {
      creditoModel.status = false;
      await ClienteModel.findByIdAndUpdate(creditoModel.cliente.id, { status: false })
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


const getPago = async (req = request, res = response) => {

  const { id } = req.params;
  const { ruta } = req.usuario;

  try {

    const pago = await PagoModel.findById(id)
      .populate('credito')
      .populate('cliente');

    res.status(201).json({
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
    const { ruta } = req.usuario;
    const { valor } = req.body;
    const fecha = moment().format('DD/MM/YYYY');

    const getPago = await PagoModel.findById(idPago)
      .populate('credito', ['id']);
    const getRuta = await RutaModel.findById(ruta);
    const getCredito = await CreditoModel.findById(getPago.credito.id)
      .populate('cliente', 'id');

    // actualizamos

    // lo primero devolver todo a como estaba
    getCredito.status = true; // devolvermos el estatus del credito a true
    getCredito.saldo += getPago.valor; // devolvemos el saldo del credito a como estaba 
    getCredito.abonos -= getPago.valor; // devolvemos los abonos como estaban
    getRuta.total_cobrado -= getPago.valor; // devolvemos los abonos totales de la ruta

    // ahora volver a calcular
    if (valor > getCredito.saldo) {
      // si entra aca es porque el valor es mayor al saldo del credito
      return res.status(401).json({
        ok: false,
        msg: `El saldo del cliente es ${getCredito.saldo}`
      })
    }

    await ClienteModel.findByIdAndUpdate(getCredito.cliente.id, { status: true }); // devolvemos el estatus al cliente por si al caso ya el pago anterior habia puesto su status en false

    getPago.valor = valor; // se actualiza el valor del pago
    getPago.fecha = fecha; // se actualiza la fecha del pago

    getCredito.saldo -= valor; // se actualiza el saldo del credito
    getCredito.abonos += valor; // se actualiza los abonos del credito
    getRuta.total_cobrado += valor; // se actualiza los abonos totales de la ruta

    if (getCredito.saldo === 0) {
      // si entra a esta condicion es porque ya el saldo quedo en 0 por lo tanto el estatus del credito debe pasar a false lo mismo con el status del cliente
      getCredito.status = false;
      await ClienteModel.findByIdAndUpdate(getCredito.cliente.id, { status: false });
    };

    // ya realizadas todas la operaciones guardamos los cambios realizados
    await getCredito.save();
    await getPago.save();
    await getRuta.save();

    res.status(200).json({
      ok: true,
      getPago
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
  updatePago
}