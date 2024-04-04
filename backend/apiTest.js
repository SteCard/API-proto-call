const express = require ('express');
const bodyparser = require ('body-parser');
const cors = require ('cors');
const mysql = require ('mysql2');
const axios = require('axios');

const app = express();

app.use(cors());
app.use (bodyparser.json());

//DB connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'dropfaci_arpab_2',
    port: 3306
})

//Check DB connection
db.connect(err=>{
    if(err){console.log(err, 'db err');}
    console.log('Database connected...');
});


//Get all data - GET
app.get('/test',(req, res)=>{
    
    let qr = `SELECT * FROM test`;
    
    db.query(qr, (err, result)=>{
        if(err){
            console.log(err, 'errs');
            // error response
            return res.status(500).send({
                message: 'Error occurred while fetching data',
                error: err
            });
        }
        
        if(result.length>0){
            res.send({
                message: 'all data',
                data: result
            });
        }
    });
});

//Get single data - GET
app.get('/test/:id', (req, res)=>{
    let gID = req.params.id;
    let qr =`SELECT * FROM test WHERE id = ${gID}`;
    db.query(qr, (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).send({
                message: 'Error occurred while fetching data',
                error: err
            });
        }
        if(result.length>0){
            res.send({
                message: 'Single data',
                data: result
            });
        }
        else {
            res.send({
                message: 'data not found'
            });
        }
    })
});

// Create data - POST per la tabella "test"
app.post('/test', (req, res)=>{
    console.log(req.body, 'createdata');
    
    let nome = req.body.nome;
    let cognome = req.body.cognome;
    let indirizzo = req.body.indirizzo;
    
    let qr = `INSERT INTO test (Nome, Cognome, Indirizzo) VALUES ('${nome}', '${cognome}', '${indirizzo}')`;
    
    db.query(qr, (err, result)=>{
        if(err){console.log(err);}
        
        console.log(result, 'result');
        res.send({
            message: 'data inserted into test table',
        });
    })
});

// Update single data - PUT
app.put('/test/:id', (req, res)=>{
    console.log(req.body, 'update data');

    let nome = req.body.nome;
    let cognome = req.body.cognome;
    let indirizzo = req.body.indirizzo;
    
    let id = req.params.id;
    
    let qr = `UPDATE test SET Nome = '${nome}', Cognome = '${cognome}', Indirizzo = '${indirizzo}' where id=${id}`;
    
    db.query(qr, (err, result)=>{
        if(err){console.log(err);}
        res.send({
            message: 'data updated',
        });
    })
});

// Delete single data
app.delete('/test/:id', (req, res)=>{
    let id = req.params.id;
    let qr = `DELETE FROM test WHERE id = ${id}`;
    db.query(qr, (err, result)=>{
        if(err){console.log(err);}
        
        res.send({
            message: 'data deleted'
        });
    })
});


//CHECK SERVER
app.listen(3000, ()=>{
    console.log('Server running...');
});

// AXIOS - it should work already
// const axios = require('axios');

// const apiKey = 'b354f15b912658275ccb7eeefcd33fe92d56092e43de1dc6326b20e8e2a36b46';

// axios.get('https://api.example.com/data', {
//   headers: {
//     'X-API-Key': apiKey,
//     'Accept': 'application/json' // Specifica eventuali altri header richiesti
//   }
// })
// .then(response => {
//   console.log(response.data);
// })
// .catch(error => {
//   console.error('Errore nella richiesta API:', error);
// });