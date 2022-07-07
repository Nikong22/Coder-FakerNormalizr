const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/coder';

const optionsDB = mongoose.connect(URI,
    {
      serverSelectionTimeoutMS: 1000
    },
    (error) => {
      if (error) {
        throw 'Error al conectarse a la base de datos';
      } else {
        ProductoDB.find({})
          .then((productosDB) => {
            for (let producto of productosDB) {
            }
          })
        MensajeDB.find({})
          .then((mensajesDB) => {
            for (let mensaje of mensajesDB) {
            }
            console.log("Conectado a la base de datos mongo...")
          })
      }
    });

module.exports = {
    optionsDB
}