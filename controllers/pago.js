const { request, response } = require("express");
const { CreditoModel, ClienteModel, PagoModel, RutaModel, CajaModel } = require('../models');
const moment = require('moment');
moment.tz.setDefault('America/Guatemala');

// getPagos
const getPagos = async (req = request, res = response) => {

  try {

    const { idRuta } = req.params;
    const { credito, fecha } = req.query;


    // si me mandan el cliente es porque solo quieren los pagos de un cliente
    if (credito) {
      // para obtener los pagos de cierte credito
      const pagos = await PagoModel.find({ credito, ruta: idRuta });

      if(!pagos || pagos.length === 0){
        return res.status(404).json({
          ok: false,
          msg: 'No existe este credito'
        })
      }

      return res.status(200).json({
        ok: true,
        pagos
      })
    }

    // si me mandan la fecha es porque quieren los pagos de una fecha determinada
    if (fecha) {
      const pagos = await PagoModel.find({ fecha: new RegExp(fecha, 'i'), ruta: idRuta })
        .populate('credito')
        .populate('cliente')

      return res.status(200).json({
        ok: true,
        pagos
      })
    }


    const pagos = await PagoModel.find({ ruta: idRuta, fecha})
      .populate('credito')
      .populate('cliente')

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

    const { valor, fecha, ruta } = req.body;
    const { idCredito } = req.params;

    const [ rutaModel, creditoModel, cajaActual ] = await Promise.all([
      RutaModel.findById(ruta),
      CreditoModel.findById(idCredito)
        .populate('cliente', 'id'),
      CajaModel.findOne({ruta, fecha})
    ])


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
      fecha,
      ruta,
      credito: idCredito,
      cliente: creditoModel.cliente.id
    })

    // se agrega el pago al arreglo de pagos que tiene el credito y aparte de eso se hacen las operaciones en los campos de saldo y abonos
    creditoModel.pagos.unshift(newPago);
    creditoModel.ultimo_pago = moment().utc(true).format('DD/MM/YYYY');
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
    rutaModel.total_cobrado += valor;
    await rutaModel.save();

    // actualizar la caja

    cajaActual.cobro += valor;
    cajaActual.caja_final += valor;
    cajaActual.clientes_pendientes -= 1;

    await cajaActual.save()

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
    
    const { id } = req.params;

    const pago = await PagoModel.findById(id)
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

    const [getPago, getRuta, getCredito, cajaActual, clienteModel] = await Promise.all([
      PagoModel.findById(idPago)
        .populate('credito', 'id'),
      RutaModel.findById(ruta),
      CreditoModel.findById(credito)
        .populate('cliente', 'id'),
      CajaModel.findOne({ruta, fecha}),
      ClienteModel.findById(cliente)
    ])

    // actualizamos

    // lo primero devolver todo a como estaba
    getCredito.status = true; // devolvermos el estatus del credito a true
    getCredito.saldo += getPago.valor; // devolvemos el saldo del credito a como estaba 
    getCredito.abonos -= getPago.valor; // devolvemos los abonos como estaban

    getRuta.total_cobrado -= getPago.valor; // devolvemos los abonos totales de la ruta

    cajaActual.cobro -= getPago.valor; // devolvemos el cobro de la caja a su estado normal
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

    getRuta.total_cobrado += valor; // se actualiza los abonos totales de la ruta

    cajaActual.cobro += valor;
    cajaActual.caja_final += valor;

    if (getCredito.saldo === 0) {
      // si entra a esta condicion es porque ya el saldo quedo en 0 por lo tanto el estatus del credito debe pasar a false lo mismo con el status del cliente
      getCredito.status = false;
      clienteModel.status = false;
    };

    // ya realizadas todas la operaciones guardamos los cambios realizados
    await getCredito.save();
    await getPago.save();
    await getRuta.save();
    await cajaActual.save();
    await clienteModel.save();

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
    credito.saldo += pago.valor;
    credito.abonos -= pago.valor;
    credito.pagos = credito.pagos.filter(creditoPago => creditoPago !== idPago);
    cajaActual.cobro -= pago.valor;
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
  eliminarPago
}