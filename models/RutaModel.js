const {Schema, model} = require('mongoose');

const RutaModel = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre de la ruta es obligatoria"],
    trim: true,
    uppercase: true
  },

  clientes: {
    type: Number,
    default: 0
  },

  gastos: {
    type: Number,
    default: 0
  },

  inversiones: {
    type: Number,
    default: 0
  },

  retiros: {
    type: Number,
    default: 0
  },

  ciudad: {
    type: String,
    required: [true, 'La ciudad es obligatoria'],
    uppercase: true
  },

  cartera: {
    type: Number,
    default: 0
  },

  total_cobrado: {
    type: Number,
    default: 0
  },

  total_prestado: {
    type: Number,
    default: 0
  },

  status: {
    type: Boolean,
    default: true
  },

  ultimo_cierre: {
    type: String
  },

  ultima_apertura: {
    type: String
  },

  ingresar_gastos_cobrador: {
    type: Boolean,
    default: true
  }

});

RutaModel.methods.toJSON = function() {
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('RutaModel', RutaModel);