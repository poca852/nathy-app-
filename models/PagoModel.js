const {Schema, model} = require('mongoose');

const PagoModel = new Schema({  
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

PagoModel.methods.toJSON = function(){
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('PagoModel', PagoModel)