const {Schema, model} = require('mongoose');

const Credito = new Schema({

  pagos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PagoModel'
    }
  ],

  status: {
    type: Boolean,
    default: true
  },

  valor_credito: {
    type: Number,
    required: true
  },

  interes: {
    type: Number,
    required: true
  },

  total_cuotas: {
    type: Number,
    required: true    
  },

  total_pagar: {
    type: Number,
    required: true
  },
  
  abonos: {
    type: Number,
    default: 0
  },
  
  saldo: {
    type: Number,
    required: true
  },

  valor_cuota: {
    type: Number,
    required: true
  },

  fecha_inicio: {
    type: String
  },

  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'ClienteModel'
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel'
  },

  ultimo_pago: {
    type: String,
    default: ''
  },

  notas: {
    type: String
  },

  turno: {
    type: Number,
  }
});

Credito.methods.toJSON = function(){
  const {__v, ...resto} = this.toObject();
  return resto;
}

module.exports = model('credito', Credito);