const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// DB connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dropfaci_arpab_2',
  port: 3306
});

// Check DB connection
db.connect(err => {
  if (err) {
    console.log(err, 'Errore di connessione al database');
  } else {
    console.log('Database connected...');
  }
});

// // GET all data from "protocollocem" table
// app.get('/protocollocem', (req, res) => {
//   let qr = `SELECT * FROM protocollocem`;
//   db.query(qr, (err, result) => {
//     if (err) {
//       console.log(err, 'Errore durante la query GET');
//       res.status(500).send({
//         message: 'Errore durante il recupero dei dati',
//         error: err
//       });
//     } else {
//       res.send({
//         message: 'Tutti i dati dalla tabella protocollocem',
//         data: result
//       });
//     }
//   });
// });

// GET data with optional limit
app.get('/protocollocem', (req, res) => {
    const limit = req.query.limit || 10; // Default limit is 10 if not provided
    let qr = `SELECT * FROM protocollocem LIMIT ${limit}`;
    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'Errore durante la query GET');
            res.status(500).send({
                message: 'Errore durante il recupero dei dati',
                error: err
            });
        } else {
            res.send({
                message: `Primi ${limit} dati`,
                data: result
            });
        }
    });
});

// Create data - POST
app.post('/protocollocem', (req, res) => {
  const { senso, data, protocollo, autore, mittente, destinatario } = req.body;

  // Insert data into the database
  let qr = `INSERT INTO protocollocem (senso, data, protocollo, autore, mittente, destinatario) 
            VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(qr, [senso, data, protocollo, autore, mittente, destinatario], (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query INSERT');
      res.status(500).send({
        message: 'Errore durante l\'inserimento dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Dati inseriti correttamente nella tabella protocollocem'
      });
    }
  });
});

// Update single data - PUT
app.put('/protocollocem/:idprot', (req, res) => {
  const idprot = req.params.idprot;
  const { senso, data, protocollo, autore, mittente, destinatario } = req.body;

  let qr = `UPDATE protocollocem 
            SET senso=?, data=?, protocollo=?, autore=?, mittente=?, destinatario=?
            WHERE idprot=?`;
  db.query(qr, [senso, data, protocollo, autore, mittente, destinatario, idprot], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Error occurred while updating data',
        error: err
      });
    }
    res.send({
      message: 'Data updated'
    });
  });
});

// Delete single data
app.delete('/protocollocem/:idprot', (req, res) => {
  const idprot = req.params.idprot;
  let qr = `DELETE FROM protocollocem WHERE idprot = ?`;
  db.query(qr, [idprot], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Error occurred while deleting data',
        error: err
      });
    }
    res.send({
      message: 'Data deleted'
    });
  });
});

// CHECK SERVER
app.listen(3000, () => {
  console.log('Server running...');
});
