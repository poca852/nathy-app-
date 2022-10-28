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

  clientes_activos: {
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
    default: false
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
  },

  cajas: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CajaModel'
    }
  ],

  // la caja actual hace referencia a la caja vigente
  caja_actual: {
    type: Schema.Types.ObjectId,
    ref: 'CajaModel'
  },

  // esta caja hace referencia a la caja  del dia anterior
  ultima_caja: {
    type: Schema.Types.ObjectId,
    ref: 'CajaModel'
  },

  turno: {
    type: Number,
    default: 1
  }

});

RutaModel.methods.toJSON = function() {
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('RutaModel', RutaModel);