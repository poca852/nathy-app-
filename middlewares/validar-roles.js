const {RolModel} = require('../models')

const esSuperAdmin = async(req, res, next) => {
  if(!req.usuario){
    return res.status(500).json({
      msg: 'La peticion no tiene token'
    })
  }

  const {rol, nombre} = req.usuario;
  const rolModel = await RolModel.findById(rol);

  if(rolModel.rol !== 'SUPER_ADMIN'){
    return res.status(401).json({
      msg: `${nombre} no es Super Admin - no puede hacer esto`
    })
  }


  next();
}

const tieneRol = async(req, res, next) => {
  if(!req.usuario){
    return res.status(500).json({
      msg: 'La peticion no tiene token'
    })
  }

  const {rol, nombre} = req.usuario;
  const rolDb = await RolModel.findById(rol.rol)
  if(!['SUPER_ADMIN', 'ADMIN'].includes(rolDb.rol)){
    return res.status(401).json({
      msg: 'No tiene permitido hacer esto'
    })
  }

  next();
}

module.exports = {
  esSuperAdmin,
  tieneRol
}