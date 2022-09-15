const { UsuarioModel, 
        RutaModel, 
        ClienteModel, 
        CreditoModel, 
        RolModel,
        PagoModel,
        RetiroModel,
        Gasto, 
        InversionModel} = require('../models');

// validaciones para la creacion de usuarios
const validarUsuarioById = async(userId = '') => {
  const validacion = await UsuarioModel.findById(userId);
  if(!validacion){
    throw Error(`No existe un usuario con el id ${userId}`)
  }
}

const validarUsuarioByUsername = async(username = '') => {
  const validacion = await UsuarioModel.findOne({username})
  if(validacion){
    throw Error(`El Username ${username} ya esta en uso`)
  }
}

// validaciones para rutas
const validarRutaByName = async(nombre = '') => {
  const validacion = await RutaModel.findOne({nombre})
  if(validacion){
    throw Error(`El Nombre ${nombre} ya esta en uso`)
  }
}

const validarRutaById = async(ruta = '') => {
  const validacion = await RutaModel.findById(ruta);
  if(!validacion){
    throw Error(`La ruta con el id ${ruta} no existe`)
  }
}

//  validaciones para clientes
const validarDpi = async(dpi = '') => {
  const validacion = await ClienteModel.findOne({dpi});
  if(validacion) {
    throw Error(`El dpi ${dpi} ya esta registrado`)
  }
}

const validarClienteById = async(id = '') => {
  const validacion = await ClienteModel.findById(id);
  if(!validacion) {
    throw Error(`El cliente con el id  ${id} no existe`)
  }
}

// validaciones para los creditos
const validarCreditoById = async(id = '') => {
  const validacion = await CreditoModel.findById(id);
  if(!validacion) {
    throw Error(`El credito con el id ${id} no existe`)
  }
}

// validaciones de roles
const validarExisteRol = async(rol = '') => {
  const validacion = await RolModel.findOne({rol})
  if(validacion){
    throw Error(`El rol ${rol} ya existe`)
  }
}

const validarExisteRolById = async(rol = '') => {
  const validacion = await RolModel.findById(rol)
  if(!validacion){
    throw Error(`El rol ${rol} no existe`)
  }
}

// validacines para pagos
const validarPago = async(id = '') => {
  const validacion = await PagoModel.findById(id);
  if(!validacion){
    throw Error(`El pago ${id} no existe`)
  }
}

// validaciones para gastos
const validarGastoByName = async(gasto = '') => {
  const validacion = await Gasto.find({gasto: new RegExp(gasto, 'i')});
  if(validacion.length > 0){
    throw Error(`El gasto ${gasto} ya existe`)
  }
}

const validarGastoById = async(gasto = '') => {
  const validacion = await Gasto.findById(gasto);
  if(!validacion){
    throw Error(`El gasto ${gasto} no existe`)
  }
}

// validaciones para inversion
const validarExisteInversionById = async(idInversion = '') => {
  const validacion = await InversionModel.findById(idInversion);
  if(!validacion){
    throw new Error(`No existe la inversion con id ${idInversion}`)
  }
}

// validaciones para los retiros
const validarExisteRetiroById = async(idRetiro = '') => {
  const validacion = await RetiroModel.findById(idRetiro);
  if(!validacion){
    throw new Error(`No existe un retiro con id ${idRetiro}`)
  }
}

module.exports = {
  validarUsuarioById,
  validarUsuarioByUsername,
  validarRutaByName,
  validarRutaById,
  validarDpi,
  validarClienteById,
  validarCreditoById,
  validarExisteRol,
  validarExisteRolById,
  validarPago,
  validarGastoByName,
  validarGastoById,
  validarExisteInversionById,
  validarExisteRetiroById
}