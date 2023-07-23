const {Schema, model} = require('mongoose');

const Gasto = new Schema({
  gasto: {
    type: Schema.Types.ObjectId,
    ref: 'Gasto',
    required: true
  },

  fecha: {
    type: String,
    required: true
  },

  valor: {
    type: Number,
    required: true
  },

  nota: {
    type: String,
    uppercase: true
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel'
  },

});

Gasto.methods.toJSON = function(){
  const {__v, ...resto} = this.toObject();
  return resto;
}

module.exports = model('gasto', Gasto);