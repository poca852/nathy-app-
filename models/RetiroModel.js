const {Schema, model} = require('mongoose');

const RetiroModel = new Schema({
  
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

RetiroModel.methods.toJSON = function(){
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('RetiroModel', RetiroModel);