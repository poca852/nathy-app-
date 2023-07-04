const {Schema, model} = require('mongoose');

const EmpresaModel = new Schema({
  nombre: {
    type: String,
    required: true
  },

  fecha_cobro: {
    type: Number,
    required: true
  },

});

EmpresaModel.methods.toJSON = function(){
  const {__v, ...resto} = this.toObject();
  return resto;
}

module.exports = model('EmpresaModel', EmpresaModel);