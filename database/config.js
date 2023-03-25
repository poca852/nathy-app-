const mongoose = require('mongoose');

const connection = async() => {
   try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
   } catch (error) {
      console.log(error)
      throw new Error('No se pudo inciar la db')
   }
}


module.exports = connection;