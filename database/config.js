const mongoose = require('mongoose');

const connection = async() => {
   try {
      await mongoose.connect(process.env.MONGO_URI, {
         useUnifiedTopology: true
      });
      console.log('db online')
   } catch (error) {
      console.log(error)
      throw new Error('No se pudo inciar la db')
   }
}

module.exports = connection;