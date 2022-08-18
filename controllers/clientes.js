const { request, response } = require("express");
const {ClienteModel, RutaModel} = require('../models');

const getClientes = async(req = request, res = response) => {

  const {ruta} = req.usuario;
  const {status, state = true} = req.query;
  try {
    
    const clientes = await ClienteModel.find({
      $or: [{ruta}],
      $and: [{status}, {state}]
    })
    .populate('creditos')

    res.status(200).json({
      ok: true,
      clientes
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getCliente = async(req = request, res = response) => {

  const {ruta} = req.usuario;
  const {id} = req.params;

  try {

    let cliente = await ClienteModel.findById(id);

    res.status(200).json({
      ok: true,
      cliente
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const postCliente = async(req = request, res = response) => {

  const {ruta} = req.usuario;
  const {nombre, dpi, ciudad, direccion, alias, telefono} = req.body;
  try {
    
    const cliente = await ClienteModel.create({
      nombre,
      dpi,
      ciudad,
      direccion,
      alias,
      telefono,
      ruta
    });

    // actualizamos el numero de clientes de la ruta
    const rutaModel = await RutaModel.findById(ruta);
    rutaModel.clientes += 1;
    await rutaModel.save();

    res.status(201).json({
      ok: true,
      cliente
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const pathCliente = async(req = request, res = response) => {

  const {id} = req.params;
  const {_id, ruta, usuario, ...resto} = req.body;
 
  try {

    const cliente = await ClienteModel.findByIdAndUpdate(id, resto, {new: true});

    res.status(201).json(cliente)
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const deleteCliente = async(req = request, res = response) => {

  const {id} = req.params;

  try {

    const cliente = await ClienteModel.findByIdAndUpdate(id, {estado: false});
    res.status(201).json(cliente);
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  getClientes,
  getCliente,
  postCliente,
  pathCliente,
  deleteCliente
}
