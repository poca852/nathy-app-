const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const { UsuarioModel, RutaModel } = require('../models');
const { generarJWT } = require("../helpers");
const moment = require('moment-timezone')
moment.tz.setDefault('America/Guatemala');

const login = async (req = request, res = response) => {

  const { username, password } = req.body;
  const hoy = moment().format('DD/MM/YYYY');

  try {

    // validamos que el usuario exista en la base de datos
    const user = await UsuarioModel.findOne({ username })
      .populate('rol', ['rol'])

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: `Verifique sus datos`
      })
    }

    // por si el usuario esta con estado en false
    if (!user.estado) {
      return res.status(401).json({
        ok: false,
        msg: 'Acceso denegado hable con el administrador'
      })
    }

    if(user.rol.rol !== 'COBRADOR'){
      return res.status(400).json({
        ok: false,
        msg: `Acceso denegado, usted no es cobrador`
      })
    }

    // validamos los passwords
    const validacionPassowrd = bcryptjs.compareSync(password, user.password);
    if (!validacionPassowrd) {
      return res.status(401).json({
        ok: false,
        msg: 'Verifica sus datos'
      })
    }

    // validamos que la ruta se encuentre abierta, si la ruta esta cerrada le enviamos un mensaje al cobrador diciendo que la ruta se encuentra cerrada

    const rutaModel = await RutaModel.findById(user.ruta)
      .populate("caja_actual", 'fecha');

    if(!rutaModel.status){
      return res.status(403).json({
        ok: false,
        msg: 'Ruta cerrada, hable con su administrador'
      })
    };

    if(rutaModel.caja_actual.fecha !== hoy){
      return res.status(401).json({
        ok: false,
        msg: 'NO CERRASTE LA RUTA!!! por favor avisale a tu supervisor para que la habilite.'
      })
    }

    const token = await generarJWT(user.id);

    return res.status(200).json({
      ok: true,
      user,
      token
    })

  } catch (error) {
    console.log(error)
    res.status(500), json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }


}

const renew = async (req = request, res = response) => {

  const { usuario } = req;
  
  try {

    if(usuario.rol.rol !== 'COBRADOR'){
      return res.status(401).json({
        ok: false,
        msg: 'Acceso restringido'
      })
    }

    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      user: usuario,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const renewAdmin = async (req = request, res = response) => {

  const { usuario } = req;
  
  try {

    if(usuario.rol.rol !== 'SUPER_ADMIN' && usuario.rol.rol !== 'ADMIN'){
      return res.status(401).json({
        ok: false,
        msg: 'Acceso denegado'
      })
    }

    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok: true,
      user: usuario,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

// admin login
const adminLogin = async(req = request, res = response) => {
  try {
    
    const { username, password } = req.body;

    const user = await UsuarioModel.findOne({username})
      .populate('rol', 'rol')
      .populate('rutas')

    if(!user){
      return res.status(404).json({
        ok: false,
        msg: `No existe el usuario ${username}`
      })
    }

    if(!user.estado){
      return res.status(404).json({
        ok: false,
        msg: `El usuario ${username} esta bloqueado hable con el administrador`
      })
    }

    const validacionPassowrd = bcryptjs.compareSync(password, user.password);
    if (!validacionPassowrd) {
      return res.status(401).json({
        ok: false,
        msg: 'Verifica sus datos'
      })
    }

    if(user.rol.rol !== 'SUPER_ADMIN' && user.rol.rol !== 'ADMIN'){
      console.log(user.rol.rol)
      return res.status(404).json({
        ok: false,
        msg: 'Acceso restringido'
      })
    }

    const token = await generarJWT(user.id)

    res.status(200).json({
      ok: true,
      user,
      token
    })


  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  login,
  renew,
  adminLogin,
  renewAdmin
}