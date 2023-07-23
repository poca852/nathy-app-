const {Schema, model} = require('mongoose');

const ListGasto = new Schema({
  gasto: {
    type: String,
    required: true,
    uppercase: true
  }
});

ListGasto.methods.toJSON = function(){
  const {__v, ...resto} = this.toObject();
  return resto;
}

module.exports = model('listgasto', ListGasto)