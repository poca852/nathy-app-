const { request, response } = require("express");
const { CreditoModel, ClienteModel, RutaModel, CajaModel } = require('../models');
const { generarCredito, updatedCredito } = require("../helpers/creditos");
const { getCredito } = require("../class/credito");
const actualizarRuta = require('../helpers/update-ruta');
const actualizarCaja = require("../helpers/update-caja");

const addCredito = async (req = request, res = response) => {

  try {

    const { idCliente } = req.params;
    const { ruta } = req.usuario;
    const body = req.body;
    
    const [clienteModel] = await Promise.all([
      ClienteModel.findById(idCliente),
    ])
    
    const credito = await CreditoModel.create({
      ...generarCredito(body),
      cliente: idCliente,
      ruta,
    });

    // actualizamos el status del cliente, y actualizaos el arreglo de creditos del cliente
    clienteModel.status = true;
    clienteModel.creditos.unshift(credito)
    await clienteModel.save();

    //  actualizar ruta
    await actualizarRuta(ruta)

    // actualizamos la caja
    await actualizarCaja(ruta, body.fecha_inicio)


    return res.status(201).json({
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

const creditoManual = async(req = request, res = response) => {
  const body = req.body;
  const { ruta } = req.usuario;
  const {idCliente: cliente} = req.params;

  try{
    const credito = await getCredito(body, ruta, cliente)
    return res.status(201).json({
      credito
    })
  }catch(err){
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }

  
}

const getCreditos = async (req = request, res = response) => {

  try {
    let { status, idRuta } = req.query;

    status = JSON.parse(status);

    const creditos = await CreditoModel.find({ruta: idRuta, status})
      .populate('cliente')
      .populate('pagos');

    const filterCreditos = creditos.sort((a,b) => {
      if(a.turno > b.turno) return -1;
      if(b.turno > a.turno) return 1;
      return 0;
    })

    return res.status(200).json({
      ok: true,
      creditos: filterCreditos
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getCreditoById = async (req = request, res = response) => {

  // const {ruta} = req.usuario;
  
  try {

    const { idCredito } = req.params;

    const credito = await CreditoModel.findById(idCredito)
      .populate('cliente', ['nombre', 'alias', 'direccion', 'ciudad', 'telefono'])
      .populate('pagos', ['fecha', 'valor'])

    return res.status(200).json({
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

const actualizarCredito = async (req = request, res = response) => {

  try {

    const { idCredito } = req.params;

    const { _id, 
            idCliente, 
            idRuta, 
            interes, 
            notas, 
            fecha, 
            total_cuotas,
            valor_credito  } = req.body;

    const [ ruta, credito, caja ] = await Promise.all([
      RutaModel.findById(idRuta),
      CreditoModel.findById(idCredito),
      CajaModel.findOne({ruta: idRuta, fecha}),
    ]);

    if(valor_credito){

      credito.valor_credito = valor_credito;
      credito.fecha_inicio = fecha;

      if(interes){
        credito.interes = interes;
      }

      if(total_cuotas){
        credito.total_cuotas = total_cuotas;
      }

      if(notas){
        credito.notas = notas;
      }

      // regresar todo como estaba
      ruta.total_prestado -= credito.valor_credito;
      ruta.cartera -= credito.saldo

      caja.prestamo -= credito.valor_credito;
      caja.caja_final += credito.valor_credito;

      let { total_pagar, valor_cuota } = updatedCredito( credito.valor_credito, 
        credito.interes, 
        credito.total_cuotas);

      credito.total_pagar = total_pagar;
      credito.valor_cuota = valor_cuota;
      credito.saldo = total_pagar;
      credito.abonos = 0

      // volver a calular los valores en caja y ruta
      ruta.total_prestado += valor_credito;
      ruta.cartera += total_pagar;

      caja.prestamo += valor_credito;
      caja.caja_final -= valor_credito;

      // guardar todo 
      await ruta.save();
      await caja.save();
      await credito.save();
    }

    
    return res.status(200).json({
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

const eliminarCredito = async (req = request, res = response) => {
  try {
    const { idCredito } = req.params;
    const { fecha, idCliente, idRuta } = req.body;
    
    const [ruta, credito, cliente, caja] = await Promise.all([
      RutaModel.findById(idRuta),
      CreditoModel.findById(idCredito),
      ClienteModel.findById(idCliente),
      CajaModel.findOne({ruta: idRuta, fecha})
    ])

    cliente.status = false;
    cliente.creditos = cliente.creditos.filter(c => c !== idCredito);
    ruta.total_prestado -= credito.valor_credito;
    ruta.cartera -= credito.saldo;
    caja.prestamo -= credito.valor_credito;
    caja.caja_final += credito.valor_credito;

    await CreditoModel.findByIdAndDelete(idCredito);

    // const 
    return res.status(200).json({
      msg: 'Credito eliminado correctamente'
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
  addCredito,
  getCreditos,
  getCreditoById,
  actualizarCredito,
  eliminarCredito,
  creditoManual,
}