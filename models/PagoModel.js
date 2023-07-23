const {Schema, model} = require('mongoose');

const Pago = new Schema({  
  fecha: {
    type: String
  },

  valor: {
    type: Number
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel'
  },

  credito: {
    type: Schema.Types.ObjectId,
    ref: 'CreditoModel'
  },

  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'ClienteModel'
  }
});

Pago.methods.toJSON = function(){
  const {__v, ...resto} = this.toObject();
  return resto;
}

module.exports = model('pago', Pago)