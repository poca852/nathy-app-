const { request, response } = require("express");
const {RutaModel, UsuarioModel, CreditoModel} = require('../models');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

const postRuta = async (req = request, res = response) => {

  const { nombre, ciudad } = req.body;
  const { id } = req.usuario;

  try {

    const ruta = await RutaModel.create({nombre, ciudad});
    const usuario = await UsuarioModel.findById(id);
    usuario.rutas.unshift(ruta);
    await usuario.save();

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

const getRutas = async(req = request, res = response) => {
  try{

    const {all = false} = req.query;

    if(all) {
      const rutas = await RutaModel.find();

      return res.status(200).json({
        ok: true,
        rutas
      })
    } 

    const { rutas } = req.usuario;
    let arrRutas = [];

    for (let i = 0; i < rutas.length; i++) {
      let rutaModel = await RutaModel.findById(rutas[i])
      arrRutas.push(rutaModel)
    }

    res.status(200).json({
      ok: true,
      rutas: arrRutas
    })

  }catch(err){
    console.log(err)
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

  const query = {
    status: false,
    ultimo_cierre: moment().format('DD/MM/YYYY hh:mm a')
  }

  try {

    await RutaModel.findByIdAndUpdate(idRuta, query, {new: true});

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

  const query = {
    status: true,
    ultima_apertura: moment().format('DD/MM/YYYY hh:mm a')
  }

  try {

    await RutaModel.findByIdAndUpdate(idRuta, query, {new: true});

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
  openRuta,
  getRutas
}