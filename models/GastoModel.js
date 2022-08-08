const {Schema, model} = require('mongoose');

const GastoModel = new Schema({
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

GastoModel.methods.toJSON = function(){
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('GastoModel', GastoModel);