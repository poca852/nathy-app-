const { request, response } = require('express')
const { UsuarioModel } = require('../models')

const getAllEmpleados = async (req = request, res = response) => {
  try {

    const { rutas } = req.usuario;

    let empleados = [];

    for (const ruta of rutas) {
      let consulta = await UsuarioModel.find({ ruta: ruta._id })
        .populate('ruta', ['nombre'])
        .populate('rol', ['rol'])

      empleados.push(...consulta)
    }

    res.json(empleados)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getRutas = async (req = request, res = response) => {
  try {
    const { rutas } = req.usuario;

    res.json(rutas)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const deleteEmpleado = async (req = request, res = response) => {
  try {
    const { idEmpleado: user } = req.params;

    await UsuarioModel.findByIdAndDelete(user);

    res.json({
      ok: true
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
  getAllEmpleados,
  getRutas,
  deleteEmpleado
}
