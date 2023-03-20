const { RutaModel } = require('../models');

const isOpenRuta = async(req, res, next) => {
  if(!req.usuario){
    return res.status(500).json({
      msg: 'La peticion no tiene token'
    });
  };

  const {ruta} = req.usuario;
  const modelRuta = await RutaModel.findById(ruta);

  if(!modelRuta.status){
    return res.status(404).json({
      msg: 'Ruta cerrada, hable con su administrador'
    })
  };

  next();
};

module.exports = {
  isOpenRuta
};