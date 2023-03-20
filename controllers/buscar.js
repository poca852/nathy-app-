const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { CreditoModel, UsuarioModel, ClienteModel, PagoModel } = require('../models')
const moment = require('moment');
moment.tz.setDefault('America/Guatemala');

const coleccionesPermitidas = [
  'usuarios',
  'caja',
  'clientes',
  'creditos',
  'gastos',
  'pagos'
];

const buscarClientes = async(termino = '', res = response) => {
  const esMongoId = ObjectId.isValid(termino);

  if(esMongoId){
    const cliente = await ClienteModel.findById(termino);
    return res.status(200).json({
      results: (cliente) ? [cliente] : []
    })
  }

  const regex = new RegExp(termino, 'i');
  const clientes = await ClienteModel.find({
    $or: [{nombre: regex}, {alias: regex}],
    $and: [{status: true}]
  });

  return res.status(200).json({
    results: clientes
  })
}

const buscarCreditosByName = async(termino = '', res = response, req = request) => {
  const {ruta} = req.usuario;

  const allCreditos = await CreditoModel.find({ruta, status: true})
    .populate('cliente')
    .populate('pagos', ['fecha', 'valor'])

  const creditos = allCreditos.filter(c => c.cliente.alias.includes(termino.toUpperCase()));

  if(termino === 'all'){
    return res.status(200).json({
      results: allCreditos
    })
  }

  res.status(200).json({
    results: creditos
  })

}

const buscarClienteEnPagos = async(termino = '', res = response) => {
  const { ruta } = req.usuario;

  const hoy = moment().format('DD/MM/YYYY')

  const allPagos = await PagoModel.find({ruta, fecha: new RegExp(hoy, 'i')})
    .populate('cliente')

  const pagos = allPagos.filter( p => p.cliente.alias.includes(termino.toUpperCase()))

  if(termino === 'all'){
    return res.status(200).json({
      ok: true,
      pagos: allPagos
    })
  }

  res.status(200).json({
    ok: true,
    pagos
  })

}

const buscarCaja = async(termino = '', res = response, req = request) => {
  const { rutas } = req.usuario;
  const { consulta } = req.query;
  console.log(termino, consulta)

  return res.status(200).json({
    rutas
  })
}

const buscar = (req, res = response) => {
  const {coleccion, termino = ''} = req.params;
  if(!coleccionesPermitidas.includes(coleccion)){
    return res.status(400).json({
      msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
    })
  }

  switch (coleccion) {
    case 'creditos':
      buscarCreditosByName(termino, res, req)
      break;

    case 'pagos': 
      buscarClienteEnPagos(termino, res)
      break;

    case 'clientes':
      buscarClientes(termino, res)
      break;

    case 'caja': 
      buscarCaja(termino, res, req);
      break;
  
    default:
      res.status(401).json({
        msg: 'No se programo esto'
      })
  }
}

module.exports = buscar;