const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { CreditoModel, UsuarioModel, ClienteModel } = require('../models')

const coleccionesPermitidas = [
  'usuarios',
  'caja',
  'clientes',
  'creditos',
  'gastos'
];

const buscarClientes = async(termino = '', req = request, res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  const {ruta} = req.usuario;

  if(esMongoId){
    const cliente = await ClienteModel.findById(termino);
    return res.status(200).json({
      results: (cliente) ? [cliente] : []
    })
  }

  const regex = new RegExp(termino, 'i');
  const clientes = await ClienteModel.find({
    $or: [{nombre: regex}, {alias: regex}],
    $and: [{status: true, ruta}]
  }).populate('creditos')

  res.status(200).json({
    results: clientes
  })
}

const buscar = (req, res = response) => {
  const {coleccion, termino} = req.params;
  if(!coleccionesPermitidas.includes(coleccion)){
    return res.status(400).json({
      msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
    })
  }

  switch (coleccion) {
    case 'clientes':
      buscarClientes(termino, req, res)
      break;
  
    default:
      res.status(401).json({
        msg: 'No se programo esto'
      })
  }
}

module.exports = buscar;