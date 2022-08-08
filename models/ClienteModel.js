const {Schema, model} = require('mongoose');

const ClienteModel = new Schema({

  status: {
    type: Boolean,
    default: false
  },
  
  state: {
    type: Boolean,
    default: true
  },

  dpi: {
    type: String,
    required: [true, 'El dpi es obligatorio']
  },

  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    uppercase: true
  },

  alias: {
    type: String,
    required: [true, 'El alias es obligatorio'],
    uppercase: true
  },

  ciudad: {
    type: String,
    required: [true, 'La ciudad es obligatorio'],
    uppercase: true
  },

  direccion: {
    type: String,
    required: [true, 'La direccion es obligatoria'],
    uppercase: true
  },

  telefono: {
    type: String,
    required: [true, 'El telefono es obligatorio']
  },

  img: {
    type: String
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel'
  },

  creditos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CreditoModel'
    }
  ]

});

ClienteModel.methods.toJSON = function(){
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('ClienteModel', ClienteModel);