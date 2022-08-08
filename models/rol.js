const {Schema, model} = require('mongoose');

const RolModel = new Schema({
  rol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  }
})

RolModel.methods.toJSON = function(){
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('RolModel', RolModel)