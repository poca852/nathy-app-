const {Schema, model} = require('mongoose');

const Empresa = new Schema({
  nombre: {
    type: String,
    required: true
  },

  fecha_cobro: {
    type: Number,
    required: true
  },

});

Empresa.methods.toJSON = function(){
  const {__v, ...resto} = this.toObject();
  return resto;
}

module.exports = model('empresa', Empresa);