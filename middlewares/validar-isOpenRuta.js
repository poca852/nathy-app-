const { request, response } = require('express');
const { RutaModel } = require('../models');

const isOpenRuta = async(req = request, res = response, next) => {

  if(!req.usuario){
    return res.status(500).json({
      msg: 'La peticion no tiene token'
    });
  };

  const { ruta } = req.usuario;
  const modelRuta = await RutaModel.findById(ruta);

  if(!modelRuta.status) {
    return res.status(400).json({
      msg: 'La ruta esta cerrada, hable con el administrador'
    });
  };

  next()

};

module.exports = isOpenRuta;