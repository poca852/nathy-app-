const { request, response } = require("express")
const {Gasto} = require('../models')

const addGasto = async(req = request, res = response) => {
  try {
    
    const { gasto } = req.body;
    const add_gasto = await Gasto.create({gasto})

    res.status(201).json({
      ok: true,
      add_gasto
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getGastos = async(req = request, res = response) => {
  try {
    const gastos = await Gasto.find();
    res.status(200).json({
      ok: true,
      gastos
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getGasto = async(req = request, res = response) => {
  try {
    const {id} = req.params;
    const gasto = await Gasto.findById(id);
    res.status(200).json({
      ok: true,
      gasto
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const putGasto = async(req = request, res = response) => {
  try {
    const {id} = req.params;
    const {gasto} = req.body;
    const update_gasto = await Gasto.findByIdAndUpdate(id, {gasto} , {new: true})

    res.status(201).json({
      ok: true,
      update_gasto
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const deleteGasto = async(req = request, res = response) => {
  try {
    const {id} = req.params;
    const delete_gasto = await Gasto.findByIdAndRemove(id)

    res.status(200).json({
      ok: true,
      delete_gasto
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
  addGasto,
  getGastos,
  getGasto,
  putGasto,
  deleteGasto
}