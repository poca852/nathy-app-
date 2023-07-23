const {Schema, model} = require('mongoose');

const Caja = new Schema({

  fecha: {
    type: String,
    required: true,
  },

  base: {
    type: Number,
    required: true,
    default: 0
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
    default: 0
  },

  clientes_pendientes: {
    type: Number,
    required: true,
    default: 0
  },

  renovaciones: {
    type: Number,
    required: true,
    default: 0
  },

  caja_final: {
    type: Number,
    required: true,
    default: 0
  },

  pretendido: {
    type: Number,
    required: true,
    default: 0
  },

  extra: {
    type: Number,
    default: 0
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel',
    required: true
  },
});

Caja.methods.toJSON = function(){
  const { __v, ...resto } = this.toObject();
  return resto;
}

module.exports = model('caja', Caja);