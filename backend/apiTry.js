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

// AXIOS
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

//Get all data - GET
app.get('/protocollocem',(req, res)=>{

    let qr = `SELECT * FROM protocollocem`;

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
app.get('/protocollocem/:idprot', (req, res)=>{
    let gID = req.params.idprot;
    let qr =`SELECT * FROM protocollocem WHERE idprot = ${gID}`;
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

// Create data - POST
app.post('/protocollocem', (req, res)=>{
    console.log(req.body, 'createdata');

    let senso = req.body.senso;
    let data = req.body.data;
    let protocollo = req.body.protocollo;

    let qr = `INSERT INTO protocollocem (senso, data, protocollo) VALUES ('${senso}', '${data}', '${protocollo}')`;

    db.query(qr, (err, result)=>{
        if(err){console.log(err);}

        console.log(result, 'result');
        res.send({
            message: 'data inserted',
        });
    })
});

// Updata single data - PUT
app.put('/protocollocem/:idprot', (req, res)=>{

    console.log(req.body, 'update data');

    let senso = req.body.senso;
    let data = req.body.data;
    let protocollo = req.body.protocollo;

    let idprot = req.params.idprot;

    let qr = `UPDATE protocollocem SET senso = '${senso}', data = '${data}', protocollo = '${protocollo}' where idprot=${idprot}`;

    db.query(qr, (err, result)=>{
        if(err){console.log(err);}
        res.send({
            message: 'data updated',
        });
    })
});

// DELETE single data
app.get('/protocollocem/:idprot', (req, res)=>{
    let idprot = req.params.idprot;
    let qr = `DELETE FROM protocollocem WHERE idprot = ${idprot}`;
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