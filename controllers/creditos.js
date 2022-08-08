const { request, response } = require("express");
const { CreditoModel, ClienteModel, RutaModel } = require('../models');
const { generarCredito } = require("../helpers/creditos");
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

const postCredito = async (req = request, res = response) => {

  const { idCliente } = req.params;
  const { ruta } = req.usuario;
  const { valor_credito, interes, total_cuotas } = req.body;

  try {

    // creamos la data que hace falta guardar
    const data = generarCredito(valor_credito, interes, total_cuotas);

    // creamos el credito
    const credito = await CreditoModel.create({
      ...data,
      fecha_inicio: moment().format('DD/MM/YYYY'),
      ruta, 
      cliente: idCliente
    });

    // actualizamos el status del cliente, y actualizaos el arreglo de creditos del cliente
    const clienteModel = await ClienteModel.findByIdAndUpdate(idCliente, {status: true}, {new: true});
    clienteModel.creditos.unshift(credito)
    await clienteModel.save();

    // actualizamos el camp total_prestado de la ruta
    const rutaModel = await RutaModel.findById(ruta);
    rutaModel.total_prestado += valor_credito;
    await rutaModel.save();


    res.status(201).json({
      ok: true,
      credito
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getCreditos = async (req = request, res = response) => {

  const { ruta } = req.usuario;
  try {

    const creditos = await CreditoModel.find({ruta, status: true})
      .populate('cliente', ['nombre', 'alias', 'direccion', 'ciudad', 'telefono'])
      .populate('pagos', ['fecha', 'valor'])

    res.status(200).json({
      ok: true,
      creditos
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getCredito = async (req = request, res = response) => {

  // const {ruta} = req.usuario;
  const { id } = req.params;

  try {

    const credito = await CreditoModel.findById(id)
    .populate('cliente', ['nombre', 'alias', 'direccion', 'ciudad', 'telefono'])
    .populate('pagos', ['fecha', 'valor'])

    res.status(200).json({
      ok: true,
      credito
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const patchCredito = async (req = request, res = response) => {

  const { id } = req.params;
  const data = req.body;

  try {

    const credito = await CreditoModel.findByIdAndUpdate(id, data);
    
    res.status(200).json({
      ok: true,
      credito
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const deleteCredito = async (req = request, res = response) => {
  const { id } = req.params;
  try {

    // const 
    res.json({
      msg: 'pendiente por resolver'
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
  postCredito,
  getCreditos,
  getCredito,
  patchCredito,
  deleteCredito,
}