const {Schema, model} = require('mongoose');

const Gasto = new Schema({
  gasto: {
    type: String,
    required: true,
    uppercase: true
  }
});

Gasto.methods.toJSON = function(){
  const {__v, _id, ...resto} = this.toObject();
  resto.id = _id;
  return resto;
}

module.exports = model('Gasto', Gasto)