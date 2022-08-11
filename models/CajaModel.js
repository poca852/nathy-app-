const {Schema, model} = require('mongoose');

const CajaModel = new Schema({

  fecha: {
    type: String,
    required: true
  },

  base: {
    type: Number
  },

  inversion: {
    type: Number
  },

  retiro: {
    type: Number
  },

  gasto: {
    type: Number
  },

  cobro: {
    type: Number
  },
  prestamo: {
    type: Number
  },
  total_clientes: {
    type: Number
  },
  clientes_pendientes: {
    type: Number
  },
  renovaciones: {
    type: Number
  },
  caja_final: {
    type: Number
  },

  pretendido: {
    type: Number
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel'
  },
});

CajaModel.methods.toJSON = function(){
  const { __v, _id, ...resto } = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('CajaModel', CajaModel);