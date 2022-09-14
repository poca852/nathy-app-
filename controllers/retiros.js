const { request, response } = require("express");
const {RetiroModel, RutaModel, CajaModel} = require('../models');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

const postRetiro = async (req = request, res = response) => {

  const {ruta} = req.usuario;
  const body = req.body;

  try {

    const retiro = await RetiroModel.create({
      ...body, 
      ruta
    });

    const rutaModel = await RutaModel.findById(ruta);
    rutaModel.retiros += body.valor;
    await rutaModel.save();

    // actualizamos la caja
    const cajaActual = await CajaModel.findById(rutaModel.caja_actual._id)

    cajaActual.retiro += body.valor;
    cajaActual.caja_final -= body.valor;
    await cajaActual.save();

    res.status(201).json({
      ok: true,
      retiro
    })

  } catch (error) {
    console.log(error)
    res.status(500), json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }


}

const getRetiros = async (req = request, res = response) => {

  const {ruta} = req.usuario;

  try {
    
    const retiros = await RetiroModel.find({ruta});

    res.status(200).json({
      ok: true,
      retiros
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
  postRetiro,
  getRetiros
}