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


const buscarCreditosByName = async(termino = '', req = request, res = response) => {
  const {ruta} = req.usuario;

  const allCreditos = await CreditoModel.find({ruta, status: true})
    .populate('cliente', ['nombre', 'alias', 'direccion', 'ciudad', 'telefono'])
    .populate('pagos', ['fecha', 'valor'])

  const creditos = allCreditos.filter(c => c.cliente.alias.includes(termino.toUpperCase()));

  if(termino === 'all'){
    return res.status(200).json({
      ok: true,
      creditos: allCreditos
    })
  }

  res.status(200).json({
    ok: true,
    creditos
  })

}

const buscarClienteEnPagos = async(termino = '', req = request, res = response) => {
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

const buscar = (req, res = response) => {
  const {coleccion, termino = ''} = req.params;
  if(!coleccionesPermitidas.includes(coleccion)){
    return res.status(400).json({
      msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
    })
  }

  switch (coleccion) {
    case 'creditos':
      buscarCreditosByName(termino, req, res)
      break;

    case 'pagos': 
      buscarClienteEnPagos(termino, req, res)
      break;
  
    default:
      res.status(401).json({
        msg: 'No se programo esto'
      })
  }
}

module.exports = buscar;