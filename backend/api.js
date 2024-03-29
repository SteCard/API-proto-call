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

//CHECK SERVER
app.listen(3000, ()=>{
    console.log('Server running...');
});