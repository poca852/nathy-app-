const { request, response } = require("express");

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

    // const { all = false } = req.query;

    // if (all) {
    //   const rutas = await RutaModel.find();

    //   return res.status(200).json({
    //     ok: true,
    //     rutas
    //   })
    // }

    // const { rutas } = req.usuario;
    // let arrRutas = [];
    // let creditos = [];
    // for (let i = 0; i < rutas.length; i++) {
    //   let rutaModel = await RutaModel.findById(rutas[i])
    //   let creditos = await CreditoModel.find({ ruta: rutas[i], status: true })
    //   let cartera = 0;

    //   creditos.forEach(credito => {
    //     cartera += credito.saldo
    //   })

    //   rutaModel.cartera = cartera
    //   await rutaModel.save()
    //   arrRutas.push(rutaModel)
    // }

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
      CajaModel.findOne({ruta: idRuta, fecha})
    ])

    // cerramos la ruta
    ruta.status = false;
    ruta.ultimo_cierre = fecha;
    ruta.ultima_caja = caja.id;

    await ruta.save()

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
    const [creditosActivos, total_clientes, ruta, cajas] = await Promise.all([
      CreditoModel.find({ ruta: idRuta, status: true }),
      CreditoModel.countDocuments({ ruta: idRuta, status: true }),
      RutaModel.findById(idRuta)
        .populate('ultima_caja'),
      CajaModel.find({ruta: idRuta})
    ])

    let pretendido = 0;
    creditosActivos.forEach(credito => {
      pretendido += credito.valor_cuota
    })

    let bodyCaja; // ESTE ES EL OBJETO QUE GUARDAREMOS EN LA NUEVA CAJA

    // Validamos que hayan cajas previas antes de crear la nueva caja 
    if (ruta.ultima_caja) {
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

    // este caso deria cuando la ruta es nueva y no han generado ninguna caja
    if(cajas.length === 0){
      bodyCaja = {
        fecha,
        ruta: idRuta
      }
    }

    // este caso seria para los que ya tienen cajas guardadas pero con el formato antiguo
    if(cajas.length >= 1){
      bodyCaja = {
        base: cajas[cajas.length - 1].caja_final,
        caja_final: cajas[cajas.length - 1].caja_final,
        total_clientes,
        clientes_pendientes: total_clientes,
        pretendido,
        ruta: idRuta,
        fecha
      }
    }


    const caja = await CajaModel.create(bodyCaja);

    ruta.caja_actual = caja.id;
    ruta.status = true;
    ruta.ultima_apertura = fecha;
    ruta.clientes_activos = total_clientes
    await ruta.save();


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
  deleteRuta
}