const {Schema, model} = require('mongoose');

const Rol = new Schema({
  rol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  }
})

Rol.methods.toJSON = function(){
  const {__v, ...resto} = this.toObject();
  return resto;
}

module.exports = model('rol', Rol)