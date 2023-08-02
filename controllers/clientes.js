const { request, response } = require("express");
const { Cliente, Ruta } = require('../models');

const getClientes = async (req = request, res = response) => {

  try {
    const { idRuta } = req.params;
    let { status } = req.query;

    status = JSON.parse(status);

    const clientes = await Cliente.find({ruta: idRuta, status})
      .populate('creditos')

    return res.status(200).json({
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

const getClienteById = async (req = request, res = response) => {
  try {

    const { idCliente } = req.params;

    const cliente = await Cliente.findById(idCliente)
      .populate({
        path: 'creditos',
        populate: {path: 'pagos'}
      })

    return res.status(200).json({
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

const addCliente = async (req = request, res = response) => {

  try {
    
    const body = req.body;
    const { ruta } = req.usuario;

    // verifico que el dpi ya existe en dicha ruta
    const verificarSiExisteClienteEnRuta = await Cliente.findOne({ ruta, dpi: body.dpi });
    if (verificarSiExisteClienteEnRuta) {
      return res.status(400).json({
        ok: false,
        msg: `El cliente ${verificarSiExisteClienteEnRuta.nombre} ya existe en esta ruta`
      })
    };

    const [nuevoCliente, rutaModel] = await Promise.all([
      Cliente.create({...body, ruta}),
      Ruta.findById(ruta)
    ])

    // actualizamos el numero de clientes de la ruta
    rutaModel.clientes += 1;
    await Ruta.save();

    return res.status(201).json({
      ok: true,
      cliente: nuevoCliente
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const actualizarCliente = async (req = request, res = response) => {

  
  try {
    const { idCliente } = req.params;
    const { _id, idRuta, ...resto } = req.body;
    const cliente = await Cliente.findByIdAndUpdate(idCliente, resto, { new: true });

    return res.status(201).json(cliente)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const eliminarCliente = async (req = request, res = response) => {

  try {
    const { idCliente } = req.params;
    const { idRuta } = req.body;

    const [ruta, cliente] = await Promise.all([
      Ruta.findById(idRuta),
      Cliente.findById(idCliente)
    ])

    if(cliente.status){
      return res.status(400).json({
        ok: false,
        msg: 'Hable con el administrador del sistema, este cliente aun tiene un credito activo'
      })
    }

    ruta.clientes -= 1;
    await Cliente.findByIdAndDelete(idCliente);
    await ruta.save();

    return res.status(201).json({
      ok: true,
      msg: 'Cliente eliminado correctamente'
    });

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
  getClienteById,
  addCliente,
  actualizarCliente,
  eliminarCliente
}
