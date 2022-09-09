const { request, response } = require("express");
const {CajaModel} = require('../models');

const getCaja = async(req = request, res = response) => {

  const { ruta } = req.usuario;
  const { fecha } = req.query;

  try {
    // verificar si ya existe una caja con la fecha dada
    const caja = await CajaModel.findOne({ruta, fecha})
      .populate('ruta')

    if(!caja) {
      return res.status(400).json({
        ok: false,
        msg: 'aun no se ha creado una caja'
      })
    }

    res.status(200).json({
      ok: true,
      caja
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
  // postCaja,
  getCaja
}