//server.js

var express	= require('express');
var app = express();
var mongoose = require('mongoose');


// Conexión con la base de datos

mongoose.connect('mongodb://127.0.0.1:27017/angadm', function(error){
   if(error){
      console.log('Error a MongoDB');
   }else{
      console.log('Conectado a MongoDB');
   }
});

// Configuración
app.configure(function() {
    // Localización de los ficheros estáticos
    app.use(express.static(__dirname + '/public'));
    // Muestra un log de todos los request en la consola        
    app.use(express.logger('dev')); 
    // Permite cambiar el HTML con el método POST                   
    app.use(express.bodyParser());
    // Simula DELETE y PUT                      
    app.use(express.methodOverride());                  
});

// Escucha en el puerto 8080 y corre el server
app.listen(3000, function() {
    console.log('App listening on port 3000');
});

app.get('*', function(req, res) {						
    res.sendfile('./index.html');				
});

var notasSchema = mongoose.Schema({
    titulo: { type : String, trim : true, index : true },
    prioridad : String,
    descripcion : String,
    autor : String  });

var Notas  = mongoose.model('notas', notasSchema);


app.post('/api/notass', function(req, res) {              
    Notas.find(function(err, notas) {
        if(err) {
            res.send(err);
        }
        res.json(notas);
    });
});


// POST que crea un TODO y devuelve todos tras la creación
app.post('/api/notas', function(req, res) {   

    console.log(res);
    Notas.create({
        titulo: req.body.titulo,
        prioridad : req.body.prioridad,
        descripcion : req.body.descripcion,
        autor : req.body.autor,
        done: false
    }, function(err, notas){
        if(err) {
            res.send(err);
        }
        res.json(notas);
    
    });
});


app.delete('/api/notas/:nota', function(req, res) {     
     console.log(res);
    Notas.remove({
        _id: req.params.nota
    }, function(err, nota) {
        if(err){
            res.send(err);
        }

        Notas.find(function(err, notas) {
            if(err){
                res.send(err);
            }
            res.json(notas);
        });

    })
});