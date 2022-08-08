const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const UsuarioModel = require("../models/UsuarioMode");

const postUsuarios = async(req=request, res=response) => {
  
  // extraemos la data que viene el body
  const {username, password, nombre, rol} = req.body;
 
  try {
    
    const usuario = new UsuarioModel({username, password, nombre, rol});

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // guardamos el usuario
    await usuario.save();

    res.status(201).json({
      ok: true,
      usuario
    });

  } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: 'Hable con el administrador'
      })
  }
};

const getUsuarios = async(req = request, res = response) => {

  const {estado = true} = req.query;

  try {

    const usuarios = await UsuarioModel.find({estado})
      .populate('ruta', ['nombre', 'ciudad']);
    res.json({
      ok: true,
      usuarios
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'hable con el admistrador'
    })
  }
  
};

const getUsuario = async(req = request, res = response) => {
  const {id} = req.params;
  try {
    const usuario = await UserModel.findById(id);

    res.status(200).json({
      ok: true,
      usuario
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
};

const putUsuarios = async(req = request, res = response) => {
  
  const { id } = req.params;
  const { _id, password, ...resto } = req.body;

  try {
    

    if( password ){
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await UserModel.findByIdAndUpdate(id, resto, {new: true})

    res.status(200).json({
      ok: true,
      usuario
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
};


const deleteUsuarios = async(req = request, res = response) => {
  const {id} = req.params;
  try {
    const usuario = await UserModel.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.status(200).json({
      ok: true,
      usuario
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
};

module.exports = {
  postUsuarios,
  getUsuarios,
  putUsuarios,
  getUsuario,
  deleteUsuarios,
}