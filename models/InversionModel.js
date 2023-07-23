const {Schema, model} = require('mongoose');

const Inversion = new Schema({
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

Inversion.methods.toJSON = function(){
  const {__v, ...resto} = this.toObject();
  return resto;
}

module.exports = model('inversion', Inversion);