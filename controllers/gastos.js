const { request, response } = require("express");
const { Gasto, Ruta, CajaModel } = require('../models');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');
const { actualizarCaja, actualizarRuta } = require('../helpers');

const getGastos = async (req = request, res = response) => {

  const { idRuta } = req.params;

  try {

    const gastos = await Gasto.find({ ruta: idRuta })

    return res.status(200).json({
      ok: true,
      gastos
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getGastoById = async (req = request, res = response) => {
  try {
    const { idGasto } = req.params;

    const gasto = await Gasto.findById(idGasto);

    return res.status(200).json({
      ok: false,
      gasto
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const addGasto = async (req = request, res = response) => {

  try {
    const { gasto,
            fecha,
            valor,
            nota,
            idRuta } = req.body;

    const nuevoGasto = await Gasto.create({
      gasto,
      fecha,
      valor,
      nota,
      ruta: idRuta
    });

    await actualizarCaja(idRuta, fecha);
    await actualizarRuta(idRuta);

    return res.status(201).json({
      ok: true,
      gasto: nuevoGasto
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const actualizarGasto = async( req = request, res = response ) => {
  try{
    const { idGasto } = req.params;
    const { _id, valor, idRuta, nota, gasto, fecha } = req.body;

    const [ ruta, cajaActual, gastoModel ] = await Promise.all([
      Ruta.findById(idRuta),
      CajaModel.findOne({ruta: idRuta, fecha}),
      Gasto.findById(idGasto)
    ])

    ruta.gastos -= gastoModel.valor;
    cajaActual.gasto -= gastoModel.valor;
    cajaActual.caja_final += gastoModel.valor;

    const gastoUpdated = await GastoModel.findByIdAndUpdate(idGasto, {
      fecha,
      valor,
      nota
    }, {new: true});

    ruta.gastos -= valor;
    cajaActual.gasto -= valor;
    cajaActual.caja_final += valor;

    await ruta.save();
    await cajaActual.save();

    return res.status(200).json({
      ok: true,
      gasto: gastoUpdated
    })


  }catch(err){
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el adminisrador'
    })
  }
}
const eliminarGasto = async( req = request, res = response ) => {
  try{
    const { idGasto } = req.params;
    const { idRuta, fecha } = req.body;

    const [ ruta, cajaActual, gastoModel ] = await Promise.all([
      Ruta.findById(idRuta),
      CajaModel.findOne({ruta: idRuta, fecha}),
      GastoModel.findById(idGasto)
    ])

    ruta.gastos -= gastoModel.valor;
    cajaActual.gasto -= gastoModel.valor;
    cajaActual.caja_final += gastoModel.valor;

    await ruta.save();
    await cajaActual.save();

    // eliminamos el gasto
    await GastoModel.findByIdAndDelete(idGasto);

    return res.status(200).json({
      ok: true,
      msg: 'Gasto Eliminado correctamente'
    })
  }catch(err){
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el adminisrador'
    })
  }
}

module.exports = {
  getGastos,
  addGasto,
  getGastoById,
  actualizarGasto,
  eliminarGasto
}