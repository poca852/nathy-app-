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


const buscarCreditosByName = async(termino = '', req = request, res = response) => {
  const {ruta} = req.usuario;
  console.log(termino)

  const allCreditos = await CreditoModel.find({ruta, status: true})
    .populate('cliente', ['nombre', 'alias', 'direccion', 'ciudad', 'telefono'])
    .populate('pagos', ['fecha', 'valor'])

  const creditos = allCreditos.filter(c => c.cliente.nombre.includes(termino.toUpperCase()));

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
  
    default:
      res.status(401).json({
        msg: 'No se programo esto'
      })
  }
}

module.exports = buscar;