const {Schema, model} = require('mongoose');

const InversionModel = new Schema({
  fecha: {
    type: String
  },

  valor: {
    type: Number
  },

  nota: {
    type: String,
    uppercase: true
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel'
  }
});

InversionModel.methods.toJSON = function(){
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('InversionModel', InversionModel);