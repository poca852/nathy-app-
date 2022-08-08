const {Schema, model} = require('mongoose');

const CreditoModel = new Schema({

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
    default: 0.20
  },

  total_cuotas: {
    type: Number,
    default: 20    
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
  }
});

CreditoModel.methods.toJSON = function(){
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('CreditoModel', CreditoModel);