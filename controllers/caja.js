const { request, response } = require("express");
const Caja = require("../class/Caja");
const { actualizarCaja } = require("../helpers");
const { CajaModel, CreditoModel } = require('../models');

const getCaja = async (req = request, res = response) => {

  try {
    const { idRuta } = req.params;
    const { fecha } = req.query;

    if(!fecha){
      return res.status(401).json({
        ok: false,
        msg: 'La fecha es requerida'
      })
    }
    // verificar si ya existe una caja con la fecha dada
    const caja = await CajaModel.findOne({ ruta: idRuta, fecha })
      .populate('ruta')

    if (!caja) {
      return res.status(400).json({
        ok: false,
        msg: 'aun no se ha creado una caja'
      })
    };

    await actualizarCaja(idRuta, fecha);

    return res.status(200).json({
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

const getCajasForAdmin = async( req = request, res = response) => {
  try {

    const { limite = 5, desde = 0 } = req.query;
    const { ruta } = req.params;

    const cajas = await CajaModel.find({ruta})

    res.status(200).json(
      cajas.reverse().splice(Number(desde),Number(limite))
    )

    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const searchDate = async(req = request, res = response) => {
  const {rutas} = req.usuario;
  const {fecha} = req.query;

  try {

    let cajas = [];

    for (const ruta of rutas) {
      let q = await CajaModel.findOne({
        ruta: ruta.id,
        fecha
      })
        .populate('ruta', ['nombre'])

      cajas.push(q);
    }

    res.status(200).json(cajas)
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "Hable con el aministrador"
    })
  }
};

module.exports = {
  // postCaja,
  getCaja,
  getCajasForAdmin,
  searchDate
}