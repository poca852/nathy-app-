const { request, response } = require("express");
const { RutaModel, UsuarioModel, CreditoModel, CajaModel } = require('../models');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

const postRuta = async (req = request, res = response) => {

  const { nombre, ciudad, ingresar_gastos_cobrador = true } = req.body;

  try {

    const ruta = await RutaModel.create({ nombre, ciudad, ingresar_gastos_cobrador });

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

const getRutas = async (req = request, res = response) => {
  try {

    const { all = false } = req.query;

    if (all) {
      const rutas = await RutaModel.find();

      return res.status(200).json({
        ok: true,
        rutas
      })
    }

    const { rutas } = req.usuario;
    let arrRutas = [];
    let creditos = [];
    for (let i = 0; i < rutas.length; i++) {
      let rutaModel = await RutaModel.findById(rutas[i])
      let creditos = await CreditoModel.find({ ruta: rutas[i], status: true })
      let cartera = 0;

      creditos.forEach(credito => {
        cartera += credito.saldo
      })

      rutaModel.cartera = cartera
      await rutaModel.save()
      arrRutas.push(rutaModel)
    }

    res.status(200).json({
      ok: true,
      rutas: arrRutas
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getRuta = async (req = request, res = response) => {

  const { idRuta } = req.params;

  try {

    const ruta = await RutaModel.findById(idRuta);
    const creditos = await CreditoModel.find({ ruta, status: true });
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

const patchRuta = async (req = request, res = response) => {

  const { idRuta, idCobrador } = req.params;

  try {

    // se actualiza la ruta del cobrador
    const empleado = await UsuarioModel.findByIdAndUpdate(
      idCobrador,
      { ruta: idRuta },
      { new: true }
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

const closeRuta = async (req = request, res = response) => {
  try {

    const { idRuta } = req.params;
    const { fecha } = req.body;

    const ruta = await RutaModel.findById(idRuta);
    const caja = await CajaModel.findOne({ruta: idRuta, fecha});

    // cerramos la ruta
    ruta.status = false;
    ruta.ultimo_cierre = fecha;
    ruta.ultima_caja = caja.id;
    ruta.cajas.unshift(caja)

    await ruta.save()

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

const openRuta = async (req = request, res = response) => {
  try {
    const { idRuta } = req.params;
    const { fecha } = req.body;

    const ruta = await RutaModel.findById(idRuta)

    // ===== CREAMOS UNA CAJA ======= \\
    const [creditosActivos, total_clientes] = await Promise.all([
      CreditoModel.find({ ruta: idRuta, status: true }),
      CreditoModel.countDocuments({ ruta: idRuta, status: true })
    ])
    
    let pretendido = 0;
    creditosActivos.forEach(credito => {
      pretendido += credito.valor_cuota
    })

    let bodyCaja; // ESTE ES EL OBJETO QUE GUARDAREMOS EN LA NUEVA CAJA

    // Validamos que hayan cajas previas antes de crear la nueva caja 
    if(!ruta.ultima_caja && ruta.cajas.length === 0){
      bodyCaja = {
        ruta: idRuta,
        fecha
      }
    }else if(!ruta.ultima_caja && ruta.cajas.length > 0){
      bodyCaja = {
        base: ruta.cajas[0].caja_final,
        caja_final: ruta.cajas[0].caja_final,
        total_clientes,
        clientes_pendientes: total_clientes,
        pretendido,
        ruta: idRuta,
        fecha
      }
    }else{
      bodyCaja = {
        base: ruta.ultima_caja.caja_final,
        caja_final: ruta.ultima_caja.caja_final,
        total_clientes,
        clientes_pendientes: total_clientes,
        pretendido,
        ruta: idRuta,
        fecha
      }
    }


    const caja = await CajaModel.create(bodyCaja);
    await caja.save();

    ruta.caja_actual = caja.id;
    ruta.status = true;
    ruta.ultima_apertura = fecha;
    ruta.clientes_activos = total_clientes
    await ruta.save();
    

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

const addRutaAdmin = async(req = request, res = response) => {
  try {
    const {idAdmin, idRuta} = req.params;

    const [user, ruta] = await Promise.all([
      UsuarioModel.findById(idAdmin),
      RutaModel.findById(idRuta)
    ])

    user.rutas.push(idRuta);
    await user.save();

    res.status(200).json({
      ok: true,
      msg: `El Administrador ${user.nombre} ahora administra la ruta ${ruta.nombre}`
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
  postRuta,
  getRuta,
  patchRuta,
  closeRuta,
  openRuta,
  getRutas,
  addRutaAdmin
}