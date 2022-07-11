const express = require("express");
const util = require('util');
const routes = require("./routes/productos")
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const { normalize, schema } = require('normalizr');

const app = express();
const PORT = 8080;
const http = require("http").Server(app);
const io = require('socket.io')(http);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes)

app.set('views', './views'); // especifica el directorio de vistas
app.set('view engine', 'hbs'); // registra el motor de plantillas

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
  })
);

let server;
server = http.listen(PORT, () =>
  console.log(`Servidor HTTP escuando en el puerto ${PORT}`)
);

const mensajes = [

];

const productos = [

];

const chat = {
  id: 123,
  mensajes: mensajes
};

function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true))
}

io.on('connection', (socket) => {
  console.log('alguien se está conectado...');

  io.sockets.emit('listar', productos);

  socket.on('notificacion', (title, price, thumbnail) => {
    const producto = {
      title: title,
      price: price,
      thumbnail: thumbnail,
    };
    producto.push(productos);
    console.log(producto)

    io.sockets.emit('listar', productos)
  })

  console.log('normalizr:')
  console.log(mensajes)

  const mensajeSchema = new schema.Entity('mensajes');

  const chatSchema = new schema.Entity('chat', {
    mensajes: [mensajeSchema]
  });

  const normalizedChat = normalize(chat, chatSchema);

  // print(normalizedChat);
  console.log('Longitud antes de normalizar:', JSON.stringify(chat).length);
  console.log('Longitud después de normalizar:', JSON.stringify(normalizedChat).length);
  io.sockets.emit('mensajes', mensajes, JSON.stringify(chat).length, JSON.stringify(normalizedChat).length);

  socket.on('nuevo', (data) => {
    MensajeDB.insertMany([data])
    .then((id_insertado) => {
      mensajes['id'] = id_insertado[0];
      mensajes.push(data);
        console.log('Longitud antes de normalizar:', JSON.stringify(chat).length);
        console.log('Longitud después de normalizar:', JSON.stringify(normalizedChat).length);
        io.sockets.emit('mensajes', mensajes, JSON.stringify(chat).length, JSON.stringify(normalizedChat).length);
        console.log(`Mensajes grabados...`);
      
    });
  })

});