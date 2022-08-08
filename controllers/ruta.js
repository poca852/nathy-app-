const { request, response } = require("express");
const {RutaModel, UsuarioModel, CreditoModel} = require('../models');

const postRuta = async (req = request, res = response) => {

  const { nombre, ciudad } = req.body;

  try {

    const ruta = await RutaModel.create({nombre, ciudad});

    res.status(201).json({
      ok: true,
      ruta
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getRuta = async (req = request, res = response) => {

  const {idRuta} = req.params;

  try {

    const ruta = await RutaModel.findById(idRuta);
    const creditos = await CreditoModel.find({ruta, status: true});
    let cartera = 0;
    creditos.forEach(credito => {
      cartera += credito.saldo;
    })

    ruta.cartera = cartera;
    await ruta.save();

    res.status(200).json({
      ok: true,
      ruta
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const patchRuta = async(req = request, res = response) => {

  const {idRuta, idCobrador} = req.params;

  try {

    // se actualiza la ruta del cobrador
    const empleado = await UsuarioModel.findByIdAndUpdate(
      idCobrador, 
      {ruta: idRuta}, 
      {new: true}
    );


    res.status(200).json({
      ok: true,
      empleado
    })

    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador"
    })
  }
}

const closeRuta = async(req = request, res = response) => {

  const {idRuta} = req.params;

  try {

    await RutaModel.findByIdAndUpdate(idRuta, {status: false}, {new: true});

    res.status(200).json({
      ok: true
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const openRuta = async(req = request, res = response) => {

  const {idRuta} = req.params;

  try {

    await RutaModel.findByIdAndUpdate(idRuta, {status: true}, {new: true});

    res.status(200).json({
      ok: true
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  postRuta,
  getRuta,
  patchRuta,
  closeRuta,
  openRuta
}