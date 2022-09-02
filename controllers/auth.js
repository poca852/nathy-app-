const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const { UsuarioModel, RutaModel } = require('../models');
const { generarJWT } = require("../helpers");

const login = async (req = request, res = response) => {

  const { username, password } = req.body;

  try {

    // validamos que el usuario exista en la base de datos
    const user = await UsuarioModel.findOne({ username })
      .populate('rol', 'rol')

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: `El usuario ${username} no existe.`
      })
    }

    // por si el usuario esta con estado en false
    if (!user.estado) {
      return res.status(401).json({
        ok: false,
        msg: 'Acceso denegado hable con el administrador'
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

    if(!rutaModel.status){
      return res.status(403).json({
        ok: false,
        msg: 'La ruta se encuentra cerrada'
      })
    }

    const token = await generarJWT(user.id);

    res.status(200).json({
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
  const { admin = false } = req.query;
  
  try {

    if(admin){
      if( usuario.rol.rol === 'SUPER_ADMIN' || usuario.rol.rol === 'ADMIN' ){
        const token = await generarJWT(usuario.id);
        return res.status(200).json({
          ok: true,
          user: usuario,
          token
        })
      }

      return res.status(403).json({
        ok: false,
        msg: 'Usted no es administrador'
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
  adminLogin
}