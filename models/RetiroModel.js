const {Schema, model} = require('mongoose');

const Retiro = new Schema({
  
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
  }
});

Retiro.methods.toJSON = function(){
  const {__v, ...resto} = this.toObject();
  return resto;
}

module.exports = model('retiro', Retiro);