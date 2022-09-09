const { request, response } = require("express");
const {InversionModel, RutaModel, CajaModel} = require('../models');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

const postInversion = async(req = request, res = response) => {

  const {ruta} = req.usuario;
  const body = req.body;
  const hoy = moment().format('DD/MM/YYYY');

  try {
    
    const inversion = await InversionModel.create({
      ...body,
      fecha: hoy,
      ruta
    });

    const rutaModel = await RutaModel.findById(ruta);
    rutaModel.inversiones += body.valor;
    await rutaModel.save();

    // actualizamos la caja
    const cajaActual = await CajaModel.findOne({
      ruta: rutaModel.id,
      fecha: new RegExp(hoy, 'i')
    })

    cajaActual.inversion += body.valor;
    cajaActual.caja_final += body.valor;
    await cajaActual.save()

    res.status(201).json({
      ok: true,
      inversion
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador"
    })
  }
}

const getInversiones = async(req = request, res = response) => {
  try {
    const {ruta} = req.params;

    const inversiones = await InversionModel.find({ruta})
    
    res.status(200).json({
      ok: true,
      inversiones
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getInversion = async(req = request, res = response) => {
  const {idInversion} = req.params;
  try {
    
    const inversion = await InversionModel.findById(idInversion);

    res.status({
      ok: true,
      inversion
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador"
    })
  }  
}

module.exports = {
  postInversion,
  getInversion,
  getInversiones
}