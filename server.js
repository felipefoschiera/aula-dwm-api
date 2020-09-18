// usar express
const express = require('express');
const app = express();

// usar o MongoDB
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://admin:admin@localhost:27017/trabalho?authSource=trabalho";
// const uri = "mongodb://localhost:27017/trabalho"; // sem autenticação
const ObjectId = require('mongodb').ObjectID;

// para o corpo da requisição ser usada como JSON
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: true }));
app.use(bodyParser.json());

var cors = require('cors');
app.use(cors({origin: 'http://localhost:3001'}));


MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err);
    db = client.db('trabalho');

    // Iniciar o serviço http só após conectado ao BDF
    app.listen(3000, function() {
        console.log('Arquivo server.js executanto na porta 3000!');   
    });
 });
 


// responder requisição GET
app.get('/', (req, res) => {
    res.send('Requisição HTTP GET atendida!');
});

app.get('/users', (req, res, next) => {
    db.collection('usuarios').find().toArray((err, results) => {
        if(err) return console.log(err);
        res.json(results);
        console.log(results);
    });
});

app.post('/userInsert', (req, res, next) => {  
    db.collection('usuarios').insertOne(req.body, (err, result) => {
        if (err) 
           return res.json({erro: "Erro no insert."});
        res.json({success: "Insert realizado."});
    })
 });
 
 app.put('/userUpdate/:id', (req, res) => {
    var id = req.params.id;
    db.collection('usuarios').updateOne({_id: ObjectId(id)}, 
       {$set:{
          nome: req.body.nome,
          email: req.body.email,
          celular: req.body.celular,
          senha: req.body.senha
       }}
       , (err, result) => {
          if (result.result.n < 1)
             return res.json({aviso: "Nenhum usuário alterado."});
          if (err) 
             return res.json({erro: "Erro ao alterar usuário."});
       res.json({success: "Usuário alterado com sucesso."});
    })
 });
 
 app.delete('/userDelete/:id', (req, res) => {
    var id = req.params.id;
    db.collection('usuarios').deleteOne({_id: ObjectId(id)}, (err, result)=>{
       if (result.result.n < 1)
          return res.json({aviso: "Nenhum usuário excluído."});
       if (err) 
          return res.json({erro: "Erro ao excluir usuário."});
       res.json({success: "Usuário excluído com sucesso."});
    });
 });
 
 
 