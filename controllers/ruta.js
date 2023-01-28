const { request, response } = require("express");
const { actualizarCaja } = require("../helpers");
const updateRuta = require('../helpers/update-ruta');

// models
const { RutaModel,
  UsuarioModel,
  CreditoModel,
  CajaModel } = require('../models');


const addRuta = async (req = request, res = response) => {

  try {

    const admin = await UsuarioModel.findById(req.usuario.id);

    const { nombre,
      ciudad,
      ingresar_gastos_cobrador } = req.body;


    const ruta = await RutaModel.create({
      nombre,
      ciudad,
      ingresar_gastos_cobrador
    });

    admin.rutas.push(ruta.id);
    await admin.save();

    return res.status(201).json({
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

    const { rutas: rutasAdmin } = req.usuario;
    let rutasDelAdmin = [];

    for (const ruta of rutasAdmin) {
      let query = await RutaModel.findById(ruta._id);
      rutasDelAdmin.push(query);
    }


    return res.status(200).json({
      ok: true,
      rutas: rutasDelAdmin
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getRutaById = async (req = request, res = response) => {
  try {
    const { idRuta } = req.params;

    const [ruta, creditos] = await Promise.all([
      RutaModel.findById(idRuta),
      CreditoModel.find({ruta: idRuta, status: true})
    ])

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

const actualizarRuta = async (req = request, res = response) => {
  try {

    const { idRuta } = req.params;
    const { _id, estado, status, ...resto } = req.body;

    const resultado = await RutaModel.findByIdAndUpdate(idRuta, resto, { new: true });

    res.status(200).json({
      ok: true,
      ruta: resultado
    })


  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador"
    })
  }
}

const deleteRuta = async(req = request, res = response) => {
  try {

    const admin = await UsuarioModel.findById(req.usuario.id);
    const { idRuta } = req.params;

    await RutaModel.findByIdAndDelete(idRuta);

    admin.rutas = admin.rutas.filter(ruta => ruta._id !== idRuta);
    await admin.save();

    res.json({
      ok: true
    })
    
  } catch (error) {
    console.log(erro)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const addEmpleado = async(req = request, res = response) => {
  try{

    const { idRuta } = req.params;
    const { idEmpleado } = req.body;

    const usuario = await UsuarioModel.findByIdAndUpdate(idEmpleado, {ruta: idRuta}, {new: true});
    
    return res.status(201).json({
      ok: true,
      usuario
    })

  }catch(err){
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const closeRuta = async (req = request, res = response) => {
  try {

    const { idRuta } = req.params;
    const { fecha } = req.body;

    const [ruta, caja] = await Promise.all([
      RutaModel.findById(idRuta),
      CajaModel.findOne({ruta: idRuta, fecha}),
    ])

    // cerramos la ruta
    ruta.status = false;
    ruta.ultimo_cierre = fecha;
    ruta.ultima_caja = caja.id;
    ruta.turno = 1;
    
    await ruta.save();
    await updateRuta(idRuta);

    return res.status(200).json({
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

    // ===== CREAMOS UNA CAJA ======= \\
    const [ruta, clientes_pendientes] = await Promise.all([
      RutaModel.findById(idRuta)
                .populate('ultima_caja'),
      CreditoModel.countDocuments({ruta: idRuta, status: true})
    ])


    // Validamos que hayan cajas previas antes de crear la nueva caja 
    let caja;
    if (ruta.ultima_caja) {
      caja = await CajaModel.create({
        base: ruta.ultima_caja.caja_final,
        caja_final: ruta.ultima_caja.caja_final,
        ruta: idRuta,
        clientes_pendientes,
        fecha
      })
    }else{
      caja = await CajaModel.create({
        fecha,
        ruta: idRuta
      })
    }

    await actualizarCaja(idRuta, fecha);

    ruta.caja_actual = caja.id;
    ruta.status = true;
    ruta.ultima_apertura = fecha;
    ruta.turno = 1;
    
    await ruta.save();
    await updateRuta(idRuta);


    return res.status(200).json({
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

const addRutaAdmin = async (req = request, res = response) => {
  try {
    const { idRuta } = req.params;
    const { idAdmin } = req.body

    const [user, ruta] = await Promise.all([
      UsuarioModel.findById(idAdmin),
      RutaModel.findById(idRuta)
    ])

    user.rutas.push(idRuta);
    await user.save();

    return res.status(200).json({
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
};

const closeRutaAdmin = async(req = request, res = response) => {
  try {

    const {id} = req.params;

    const ruta = await RutaModel.findById(id)
      .populate('caja_actual');

    ruta.status = false;
    ruta.ultima_caja = ruta.caja_actual._id;
    ruta.ultimo_cierre = ruta.caja_actual.fecha;  
    await ruta.save();

    return res.status(200).json({
      ok: true
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error,
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  addRuta,
  getRutaById,
  actualizarRuta,
  closeRuta,
  openRuta,
  getRutas,
  addRutaAdmin,
  addEmpleado,
  deleteRuta,
  closeRutaAdmin
}