const {Schema, model} = require('mongoose');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Guatemala');

const CajaModel = new Schema({

  fecha: {
    type: String,
    required: true,
  },

  base: {
    type: Number,
    required: true
  },

  inversion: {
    type: Number,
    required: true,
    default: 0
  },

  retiro: {
    type: Number,
    required: true,
    default: 0
  },

  gasto: {
    type: Number,
    required: true,
    default: 0
  },

  cobro: {
    type: Number,
    required: true,
    default: 0
  },

  prestamo: {
    type: Number,
    required: true,
    default: 0
  },

  total_clientes: {
    type: Number,
    required: true,
  },

  clientes_pendientes: {
    type: Number,
    required: true,
  },

  renovaciones: {
    type: Number,
    required: true,
    default: 0
  },

  caja_final: {
    type: Number,
    required: true,
  },

  pretendido: {
    type: Number,
    required: true,
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel',
    required: true
  },
});

CajaModel.methods.toJSON = function(){
  const { __v, _id, ...resto } = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('CajaModel', CajaModel);