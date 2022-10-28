const { request, response } = require("express");
const { InversionModel, RutaModel, CajaModel } = require('../models');
const actualizarCaja = require('../helpers/update-caja');
const actualizarRuta = require('../helpers/update-ruta');

const addInversion = async (req = request, res = response) => {

  try {
    const { valor, nota, idRuta, fecha } = req.body;

    const inversion = await InversionModel.create({
      valor,
      nota,
      fecha,
      ruta: idRuta
    }); 

    await actualizarCaja(idRuta, fecha)
    await actualizarRuta(idRuta)

    return res.status(201).json({
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

const getInversiones = async (req = request, res = response) => {
  try {
    const { ruta } = req.params;

    const inversiones = await InversionModel.find({ ruta })

    return res.status(200).json({
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

const getInversionById = async (req = request, res = response) => {
  try {

    const { idInversion } = req.params;
    const inversion = await InversionModel.findById(idInversion);

    return res.status({
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

const actualizarInversion = async (req = request, res = response) => {
  try {
    const { idInversion } = req.params;
    const { _id, fecha, idRuta, nota, valor } = req.body;

    const [ruta, inversion, cajaActual] = await Promise.all([
      RutaModel.findById(idRuta),
      InversionModel.findById(idInversion),
      CajaModel.findOne({ ruta: idRuta, fecha })
    ])

    // regresamos todo a como estaba
    ruta.inversiones -= inversion.valor;
    cajaActual.inversion -= inversion.valor;
    cajaActual.caja_final -= inversion.valor;

    const inversionUpdated = await InversionModel.findByIdAndUpdate(idInversion, {
      fecha, nota, valor
    })

    // actualizamos los valores
    ruta.inversiones += valor;
    cajaActual.inversion += valor;
    cajaActual.caja_final += valor;

    await ruta.save();
    await inversion.save();
    await cajaActual.save();

    return res.status(200).json({
      ok: true,
      inversion: inversionUpdated
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const eliminarInversion = async (req = request, res = response) => {
  try {
    const { idInversion } = req.params;
    const { fecha, idRuta } = req.body;

    const [ruta, inversion, cajaActual] = await Promise.all([
      RutaModel.findById(idRuta),
      InversionModel.findById(idInversion),
      CajaModel.findOne({ ruta: idRuta, fecha })
    ])

    ruta.inversiones -= inversion.valor;
    cajaActual.inversion -= inversion.valor;
    cajaActual.caja_final -= inversion.valor;

    await ruta.save();
    await inversion.save();
    await cajaActual.save();

    await InversionModel.findByIdAndDelete(idInversion);

    return res.status(200).json({
      ok: true,
      msg: `Inversion eliminada correctamente`
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
  addInversion,
  getInversionById,
  getInversiones,
  actualizarInversion,
  eliminarInversion
}