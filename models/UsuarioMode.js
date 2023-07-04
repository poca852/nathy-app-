const { Schema, model } = require('mongoose');


const UsuarioModel = new Schema({
  nombre: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },

  estado: {
    type: Boolean,
    default: true
  },

  username: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },

  password: {
    type: String,
    required: true
  },

  rol: {
    type: Schema.Types.ObjectId,
    ref: 'RolModel'
  },

  ruta: {
    type: Schema.Types.ObjectId,
    ref: 'RutaModel'
  },

  fecha_cobro: {
    type: String,
    default: '19'
  },

  rutas: [
    {
      type: Schema.Types.ObjectId,
      ref: 'RutaModel'
    }
  ],

  empresa: {
    type: Schema.Types.ObjectId,
    ref: "EmpresaModel"
  }
});

UsuarioModel.methods.toJSON = function(){
  const {__v, _id, password, ...resto} = this.toObject();
  resto.id = _id
  return resto;
}

module.exports = model('UsuarioModel', UsuarioModel);