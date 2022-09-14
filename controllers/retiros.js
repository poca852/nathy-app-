const { request, response } = require("express");

// modelos
const { RetiroModel, 
        RutaModel, 
        CajaModel } = require('../models');
        
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

const addRetiro = async (req = request, res = response) => {
  try {

    const { idRuta, fecha, valor, nota } = req.body;

    const retiro = await RetiroModel.create({
      ruta: idRuta,
      fecha,
      valor,
      nota
    });

    // Actualizar la ruta y la caja
    const [rutaModel, cajaActual] = await Promise.all([
      RutaModel.findById(idRuta),
      CajaModel.findOne({ruta: idRuta, fecha})
    ]);

    rutaModel.retiros += valor;
    await rutaModel.save();

    // actualizamos la caja

    cajaActual.retiro += valor;
    cajaActual.caja_final -= valor;
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
  try {

    const { idRuta } = req.params;

    const [total, retiros] = await Promise.all([
      RetiroModel.countDocuments({ ruta: idRuta }),
      RetiroModel.find({ ruta: idRuta })
    ])


    return res.status(200).json({
      ok: true,
      total,
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

const getRetiroById = async (req = request, res = response) => {
  try {

    const { idRetiro } = req.params;

    const retiro = await RetiroModel.findById(idRetiro);

    return res.status(200).json({
      ok: true,
      retiro
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const actualizarRetiro = async (req = request, res = response) => {
  try {

    const { idRetiro } = req.params;
    const { _id, idRuta, ...resto } = req.body;

    const [retiro, caja, ruta] = await Promise.all([
      RetiroModel.findById(idRetiro),
      CajaModel.findOne({ ruta: idRuta, fecha: resto.fecha }),
      RutaModel.findById(idRuta)
    ])

    // regresar todo como estaba
    caja.retiro -= retiro.valor;
    caja.caja_final += retiro.valor;

    ruta.retiros -= retiro.valor;

    // actualizamos el retiro
    const retiroUpdated = await RetiroModel.findByIdAndUpdate(idRetiro, resto, { new: true });

    // volver a actualizar los demas valores
    caja.retiro += resto.valor;
    caja.caja_final += resto.valor;

    ruta.retiros += resto.valor;

    // guardar los cambios en los modelos involucrador
    await caja.save();
    await ruta.save();

    return res.status(200).json({
      ok: true,
      retiro: retiroUpdated
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const eliminarRetiro = async (req = request, res = response) => {
  try {
    const { idRetiro } = req.params;
    const { fecha, idRuta } = req.body;

    const [retiro, caja, ruta] = await Promise.all([
      RetiroModel.findById(idRetiro),
      CajaModel.findOne({ ruta: idRuta, fecha }),
      RutaModel.findById(idRuta)
    ])

    //devolver todo como estaba
    caja.retiro -= retiro.valor;
    caja.caja_final += retiro.valor;
    ruta.retiros -= retiro.valor;

    await RetiroModel.findByIdAndDelete(idRetiro);

    await caja.save();
    await ruta.save();

    return res.status(200).json({
      ok: true,
      msg: 'El retiro fue eliminado correctamente'
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  addRetiro,
  getRetiros,
  getRetiroById,
  actualizarRetiro,
  eliminarRetiro
}