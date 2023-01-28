const { request, response } = require("express");
const { CreditoModel, ClienteModel, PagoModel, RutaModel, CajaModel } = require('../models');
const moment = require('moment');
const { calcularExtra } = require("../helpers/caja");
const { actualizarRuta, actualizarCaja } = require("../helpers");
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

    const { valor, fecha } = req.body;
    const { idCredito } = req.params;
    const { ruta: idRuta } = req.usuario;

    const queryFecha = fecha.split(' ');

    const [ ruta, credito ] = await Promise.all([
      RutaModel.findById(idRuta),
      CreditoModel.findById(idCredito)
        .populate('cliente', 'id')
    ])

    // verifico que el valor sea menor al saldo del credito 
    if (valor > credito.saldo) {
      return res.status(401).json({
        ok: false,
        msg: `El saldo del cliente es ${credito.saldo}`
      })
    }

    // contrario si no es mayor entonces procesamos el pago
    const newPago = await PagoModel.create({
      valor,
      fecha,
      ruta: idRuta,
      credito: idCredito,
      cliente: credito.cliente.id,
    })

    // se agrega el pago al arreglo de pagos que tiene el credito y aparte de eso se hacen las operaciones en los campos de saldo y abonos
    credito.pagos.unshift(newPago);
    credito.ultimo_pago = queryFecha[0];
    credito.abonos += valor;
    credito.saldo -= valor;
    credito.turno = ruta.turno;

    ruta.turno += 1;

    // si el saldo del credito despues de hacer el pago es 0 tenemos que cambiar el status del credito y del cliente
    if (credito.saldo === 0) {
      credito.status = false;
      await ClienteModel.findByIdAndUpdate(credito.cliente.id, { status: false })
    };
    
    await ruta.save();
    await credito.save();
    await actualizarRuta(idRuta);
    await actualizarCaja(idRuta, queryFecha[0])

    return res.status(201).json({
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
    const { _id, 
            credito, 
            cliente, 
            valor, 
            fecha, 
            ruta } = req.body;


    const queryFecha = fecha.split(' ');

    const [getPago, getCredito, cajaActual, clienteModel] = await Promise.all([
      PagoModel.findById(idPago)
        .populate('credito', 'id'),
      CreditoModel.findById(credito)
        .populate('cliente', 'id'),
      CajaModel.findOne({ruta, fecha: queryFecha[0]}),
      ClienteModel.findById(cliente)
    ])

    // actualizamos
    if(!getCredito.status){
      getRuta.clientes_activos += 1;
    }

    // lo primero devolver todo a como estaba
    getCredito.status = true; // devolvermos el estatus del credito a true
    getCredito.saldo += getPago.valor; // devolvemos el saldo del credito a como estaba 
    getCredito.abonos -= getPago.valor; // devolvemos los abonos como estaban

    // dependiendo si es un pago extra o no, actualizamos el campo extra o cobro respectivamente
    if(queryFecha[0] === getCredito.fecha_inicio){
      cajaActual.extra -= getPago.valor;
    }else{
      cajaActual.cobro -= getPago.valor; // devolvemos el cobro de la caja a su estado normal
    }

    cajaActual.caja_final -= getPago.valor; // devolvemos la caja final a su estado normal

    clienteModel.status = true; // devolvemos el estatus al cliente por si al caso ya el pago anterior habia puesto su status en false
    
    // ahora volver a calcular
    if (valor > getCredito.saldo) {
      // si entra aca es porque el valor es mayor al saldo del credito
      return res.status(401).json({
        ok: false,
        msg: `El saldo del cliente es ${getCredito.saldo}`
      })
    }


    getPago.valor = valor; // se actualiza el valor del pago
    getPago.fecha = fecha; // se actualiza la fecha del pago

    getCredito.saldo -= valor; // se actualiza el saldo del credito
    getCredito.abonos += valor; // se actualiza los abonos del credito

    if(queryFecha[0] === getCredito.fecha_inicio){
      cajaActual.extra += valor;
    }else{
      cajaActual.cobro += valor;
    }

    cajaActual.caja_final += valor;

    if (getCredito.saldo === 0) {
      // si entra a esta condicion es porque ya el saldo quedo en 0 por lo tanto el estatus del credito debe pasar a false lo mismo con el status del cliente
      getCredito.status = false;
      clienteModel.status = false;
    };

    // ya realizadas todas la operaciones guardamos los cambios realizados
    await getCredito.save();
    await getPago.save();
    await cajaActual.save();
    await clienteModel.save();

    await actualizarRuta(ruta);

    return res.status(200).json({
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