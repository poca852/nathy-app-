const { request, response } = require("express");
const { Credito, Cliente } = require('../models');
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

    const [cliente] = await Promise.all([
      Cliente.findById(idCliente),
    ])

    const credito = await Credito.create({
      ...generarCredito(body),
      cliente: idCliente,
      ruta,
    });

    // actualizamos el status del cliente, y actualizaos el arreglo de creditos del cliente
    cliente.status = true;
    cliente.creditos.unshift(credito)
    await cliente.save();

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

    const creditos = await Credito.find({ ruta: idRuta, status })
      .populate({
        path: "cliente",
        select: "nombre alias"
      })
      .populate('pagos');

    const filterCreditos = creditos.sort((a, b) => {
      if (a.turno > b.turno) return -1;
      if (b.turno > a.turno) return 1;
      return 0;
    })

    return res.status(200).json(filterCreditos);

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const getCreditoById = async (req = request, res = response) => {

  try {

    const { idCredito } = req.params;

    const credito = await Credito.findById(idCredito)
      .populate('cliente', ['nombre', 'alias', 'direccion', 'ciudad', 'telefono'])
      .populate('pagos', ['fecha', 'valor'])

    if(!credito){
      return res.status(404).json({
        msg: "No existe un credito con el id " + idCredito
      })
    }

    return res.status(200).json(credito)

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
      Credito.findById(idCredito),
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
        Credito.find({
          ruta,
          turno
        })
          .populate('cliente', 'alias'),
        Credito.findById(idCredito)
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

    await Credito.findByIdAndUpdate(idCredito, {turno: 0});
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
      Credito.findById(idCredito)
    ])

    // actualizar estado del cliente
    await Cliente.findByIdAndUpdate(credito.cliente, { status: false })

    await Credito.findByIdAndDelete(idCredito);

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
    const creditos = await Credito.find({
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