const { request, response } = require("express");

const { RetiroModel, 
        RutaModel, 
        CajaModel } = require('../models');

const addRetiro = async (req = request, res = response) => {

  try {

  const { fecha,
          valor,
          nota,
          idRuta } = req.body;

    const retiro = await RetiroModel.create({
      fecha,
      valor,
      nota, 
      ruta: idRuta
    });

    const [rutaModel, cajaActual] = await Promise.all([
      RutaModel.findById(idRuta),
      CajaModel.findOne({ruta: idRuta, fecha})
    ])

    rutaModel.retiros += valor;
    cajaActual.retiro += valor;
    cajaActual.caja_final -= valor;
    await rutaModel.save();
    await cajaActual.save();

    return res.status(201).json({
      ok: true,
      retiro
    })

  } catch (error) {
    console.log(error)
    res.status(500), json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }


}

const getRetiros = async (req = request, res = response) => {

  try {
    
    const { idRuta } = req.params;
    
    const retiros = await RetiroModel.find({ruta});

    return res.status(200).json({
      ok: true,
      retiros
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}


const getRetiroById = async (req  = request, res = response) => {
  try{

    const { idRetiro } = req.params;

    const retiro = await RetiroModel.findById(idRetiro);

    return res.status(200).json({
      ok: true,
      retiro
    })

  }catch(err){
    conosle.log(err)
    res.status(500).json({
      ok: false,
      msg: 'hable con el administrador'
    })
  }
}
const actualizarRetiro = async (req = request, res = response) => {
  try{

    const { idRetiro } = req.params;
    const {_id, ruta, fecha, valor, nota} = req.body;

    if(nota && !valor){
      const nuevoRetiro = await RetiroModel.findByIdAndUpdate(idRetiro, {fecha, nota}, {new: true});
      return res.status(201).json({
        ok: true,
        retiro: nuevoRetiro
      })
    }

    const [rutaModel, retiroModel, cajaActual] = await Promise.all([
      RutaModel.findById(ruta),
      RetiroModel.findById(idRetiro),
      CajaModel.findOne({ruta, fecha})
    ])

    // regresar todo como estaba
    rutaModel.retiros -= retiroModel.valor;
    cajaActual.retiro -= retiroModel.valor;
    cajaActual.caja_final += retiroModel.valor;

    // actualizamos el retiro
    const retiroUpdated = await RetiroModel.findByIdAndUpdate(idRetiro, {
      fecha,
      nota,
      valor
    }, {new: true});

    rutaModel.retiros += valor;
    cajaActual.retiro += valor;
    cajaActual.caja_final -= valor;

    // guardamos los cambios
    await rutaModel.save()
    await cajaActual.save()

    return res.status(200).json({
      ok: true,
      retiro: retiroUpdated
    })
 
  }catch(err){
    conosle.log(err)
    res.status(500).json({
      ok: false,
      msg: 'hable con el administrador'
    })
  }
}
const eliminarRetiro = async (req = request, res = response) => {
  try{

    const { idRetiro } = req.params;
    const { ruta, fecha } = req.body;

    const [rutaModel, retiroModel, cajaActual] = await Promise.all([
      RutaModel.findById(ruta),
      RetiroModel.findById(idRetiro),
      CajaModel.findOne({ruta, fecha})
    ])

    // regresar todo como estaba
    rutaModel.retiros -= retiroModel.valor;
    cajaActual.retiro -= retiroModel.valor;
    cajaActual.caja_final += retiroModel.valor;

    // actualizamos el retiro
    await RetiroModel.findByIdAndDelete(idRetiro);

    return res.status(200).json({
      ok: true,
      msg: 'Retiro eliminado correctamente'
    })

  }catch(err){
    conosle.log(err)
    res.status(500).json({
      ok: false,
      msg: 'hable con el administrador'
    })
  }
}

module.exports = {
  addRetiro,
  getRetiros,
  getRetiroById,
  actualizarRetiro,
  eliminarRetiro
}