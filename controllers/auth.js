const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const { UsuarioModel, RutaModel } = require('../models');
const { generarJWT } = require("../helpers");

const login = async (req = request, res = response) => {

  const { username, password } = req.body;
  const { admin = false } = req.query;

  try {

    // validamos que el usuario exista en la base de datos
    const user = await UsuarioModel.findOne({ username: username })
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
        msg: 'Verifica los datos'
      })
    }

    // una vez verificados los demas puntos verificamos que el usuario sea admin
    if(admin){
      if(user.rol.rol === 'SUPER_ADMIN' || user.rol.rol === 'ADMIN'){
        const token = await generarJWT(user.id);
  
        return res.status(200).json({
          ok: true,
          user,
          token
        })
      }

      return res.status(403).json({
        ok: false,
        msg: 'Usted no es Administrador'
      })
      
    }

    // validamos que el usuario tenga una ruta asignada
    const rutaModel = await RutaModel.findById(user.ruta);
    if(!rutaModel){
      return res.status(403).json({
        ok: false,
        msg: 'Usted no tiene una ruta asignada hable con su administrador'
      })
    }

    // validamos que la ruta se encuentre abierta, si la ruta esta cerrada le enviamos un mensaje al cobrador diciendo que la ruta se encuentra cerrada
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

module.exports = {
  login,
  renew
}