const { request, response } = require("express");
const { GastoModel, RutaModel, CajaModel } = require('../models');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

const getGastos = async (req = request, res = response) => {

  const { ruta } = req.usuario;

  try {

    const gastos = await GastoModel.find({ ruta })
    res.status(200).json({
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

const getGasto = async (req = request, res = response) => {
  try {
    const { idGasto } = req.params;

    const gasto = await GastoModel.findById(idGasto);

    res.status(200).json({
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

const postGastos = async (req = request, res = response) => {

  const { ruta } = req.usuario;
  const { valor, gasto, nota, fecha } = req.body;

  try {

    const nuevoGasto = await GastoModel.create({
      gasto,
      fecha,
      valor,
      nota,
      ruta
    });

    // actualizamos la ruta
    const rutaModel = await RutaModel.findById(ruta)
      .populate('caja_actual')
    rutaModel.gastos += valor;
    await rutaModel.save();

    // actualizamos la caja
    const cajaActual = await CajaModel.findById(rutaModel.caja_actual._id)

    cajaActual.gasto += valor;
    cajaActual.caja_final -= valor;
    await cajaActual.save();

    res.status(201).json({
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

module.exports = {
  getGastos,
  postGastos,
  getGasto
}