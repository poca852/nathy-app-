const {Schema, model} = require('mongoose');

const ClienteModel = new Schema({

  // STATUS SE REFIERE A QUE SI TIENE UN CREDITO ACTIVO
  status: {
    type: Boolean,
    default: false
  },
  
  // STATE SE REFIERE SI EL CLIENTE A SIDO BLOQUEADO  
  state: {
    type: Boolean,
    default: true
  },

  dpi: {
    type: String,
    required: [true, 'El dpi es obligatorio'],
    trim: true
  },

  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    uppercase: true,
    trim: true
  },

  alias: {
    type: String,
    required: [true, 'El alias es obligatorio'],
    uppercase: true,
    trim: true
  },

  ciudad: {
    type: String,
    required: [true, 'La ciudad es obligatorio'],
    uppercase: true,
    trim: true
  },

  direccion: {
    type: String,
    required: [true, 'La direccion es obligatoria'],
    uppercase: true,
    trim: true
  },

  telefono: {
    type: String,
    required: [true, 'El telefono es obligatorio'],
    trim: true
  },

  img: {
    type: String,
    trim: true
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel'
  },

  // CREDITOS SE REFIERE AL HISTORIAL DE LOS CREDITOS
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