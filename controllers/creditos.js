const { request, response } = require("express");
const { CreditoModel, ClienteModel, RutaModel, CajaModel } = require('../models');
const { generarCredito, updatedCredito } = require("../helpers/creditos");
const { getCredito } = require("../class/credito");
const { actualizarRuta, actualizarCaja } = require('../helpers');
const moment = require('moment');
moment().format()

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

const creditoManual = async (req = request, res = response) => {
  const body = req.body;
  const { ruta } = req.usuario;
  const { idCliente: cliente } = req.params;

  try {
    const credito = await getCredito(body, ruta, cliente)
    return res.status(201).json({
      credito
    })
  } catch (err) {
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

    const creditos = await CreditoModel.find({ ruta: idRuta, status })
      .populate('cliente')
      .populate('pagos');

    const filterCreditos = creditos.sort((a, b) => {
      if (a.turno > b.turno) return -1;
      if (b.turno > a.turno) return 1;
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

    const { interes,
      notas,
      total_cuotas,
      valor_credito } = req.body;

    const [credito] = await Promise.all([
      CreditoModel.findById(idCredito),
    ]);

    if (valor_credito) {

      credito.valor_credito = valor_credito;
      // credito.fecha_inicio = fecha;

      if (interes) {
        credito.interes = interes;
      }

      if (total_cuotas) {
        credito.total_cuotas = total_cuotas;
      }

      if (notas) {
        credito.notas = notas;
      }


      let { total_pagar, valor_cuota } = updatedCredito(credito.valor_credito,
        credito.interes,
        credito.total_cuotas);

      credito.total_pagar = total_pagar;
      credito.valor_cuota = valor_cuota;
      credito.saldo = total_pagar;
      credito.abonos = 0

      await credito.save();
    }

    await actualizarCaja(credito.ruta, credito.fecha_inicio)
    await actualizarRuta(credito.ruta)


    return res.status(200).json(true)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const actualizarTurno = async (req = request, res = response) => {
  try {
    const { idCredito } = req.params;
    const { turno } = req.body;
    const { ruta } = req.usuario;

    let { query } = req.query;
    query = JSON.parse(query);

    if (!query) {
      // validamos si ese turno ya existe
      const [validarTurno, credito] = await Promise.all([
        CreditoModel.find({
          ruta,
          turno
        })
          .populate('cliente', 'alias'),
        CreditoModel.findById(idCredito)
      ])

      if (validarTurno.length > 0) {
        return res.status(400).json({
          ok: false,
          msg: `El turno ${turno} lo tiene ${validarTurno[0].cliente.alias}, prueba con otro numero de turno`
        })
      };

      credito.turno = turno;
      await credito.save();

      return res.status(200).json(true)
    }

    await CreditoModel.findByIdAndUpdate(idCredito, {turno: 0});
    return res.status(200).json(true);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const eliminarCredito = async (req = request, res = response) => {
  try {
    const { idCredito } = req.params;

    const [credito] = await Promise.all([
      CreditoModel.findById(idCredito)
    ])

    // actualizar estado del cliente
    await ClienteModel.findByIdAndUpdate(credito.cliente, { status: false })

    await CreditoModel.findByIdAndDelete(idCredito);

    await actualizarCaja(credito.ruta, credito.fecha_inicio);
    await actualizarRuta(credito.ruta);

    return res.status(200).json(true)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getCreditoByDate = async (req = request, res = response) => {
  try {
    let { fecha, ruta } = req.query;
    const creditos = await CreditoModel.find({
      $or: [{ fecha_inicio: fecha }],
      $and: [{ ruta }]
    })
      .populate('cliente')

    return res.status(200).json(creditos)
  } catch (error) {
    console.log(error);
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
  getCreditoByDate,
  actualizarTurno
}