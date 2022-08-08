const {RolModel} = require('../models')

const addRol = async(req, res) => {
  const {rol} = req.body;
  try {
    const rolModel = await RolModel.create({rol});

    res.status(201).json({
      ok: true,
      rol: rolModel.rol
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    })
  }
}

const getRoles = async(req, res) => {
  try {
    const roles = await RolModel.find();

    res.status(201).json({
      ok: true,
      roles
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    })
  }
}

const getRol = async(req, res) => {
  const {id} = req.params;
  try {
    const rolModel = await RolModel.findById(id);
    res.status(201).json({
      ok: true,
      rol: rolModel
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    })
  }
}

const putRol = async(req, res) => {
  const {id} = req.params;
  const body = req.body;
  try {
    const rolModel = await RolModel.findByIdAndUpdate(id, body, {new: true});

    res.status(201).json({
      ok: true,
      rol: rolModel.rol
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    })
  }
}

const deleteRol = async(req, res) => {
  const {id} = req.params;
  try {
    await RolModel.findByIdAndDelete(id);
    res.status(201).json({
      ok: true
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    })
  }
}

module.exports = {
  addRol,
  getRoles,
  getRol,
  putRol,
  deleteRol
}