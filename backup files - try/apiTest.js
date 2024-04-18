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

//Approccio più dinamico per gestire le richieste POST e PUT con molti campi da gestire. Funzione di utilità per costruire dinamicamente la query SQL in base ai dati ricevuti dalla richiesta.

// Funzione per costruire la query INSERT o UPDATE in base ai dati ricevuti
const buildQuery = (table, data, id = null) => {
  let fields = '';
  let placeholders = '';
  let values = [];

  // Costruisci i campi e i segnaposto per i valori
  for (const key in data) {
    fields += `${key}, `;
    placeholders += '?, ';
    values.push(data[key]);
  }

  // Rimuovi l'ultima virgola aggiunta in eccesso
  fields = fields.slice(0, -2);
  placeholders = placeholders.slice(0, -2);

  // Costruisci la parte della query SQL
  let query = '';
  if (id) {
    // Se esiste un ID, è una query di aggiornamento
    query = `UPDATE ${table} SET ${fields.replace(/,/g, '=?,')} WHERE id=?`;
    values.push(id);
  } else {
    // Altrimenti, è una query di inserimento
    query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
  }

  return { query, values };
};

// API generica per POST e PUT
app.post('/:table', (req, res) => {
  const table = req.params.table;
  const data = req.body;
  
  // Costruisci la query e i valori dinamicamente
  const { query, values } = buildQuery(table, data);

  // Esegui la query nel database
  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante l\'inserimento dei dati',
        error: err
      });
    }
    res.send({
      message: 'Dati inseriti correttamente nella tabella ' + table
    });
  });
});

app.put('/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const data = req.body;

  // Costruisci la query e i valori dinamicamente
  const { query, values } = buildQuery(table, data, id);

  // Esegui la query nel database
  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante l\'aggiornamento dei dati',
        error: err
      });
    }
    res.send({
      message: 'Dati aggiornati correttamente nella tabella ' + table
    });
  });
});

// API per POST utilizzando payload
app.post('/:table', (req, res) => {
  const table = req.params.table;
  const payload = req.body.payload;

  // Costruisci la query e i valori dinamicamente
  const { query, values } = buildQuery(table, payload);

  // Esegui la query nel database
  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante l\'inserimento dei dati',
        error: err
      });
    }
    res.send({
      message: 'Dati inseriti correttamente nella tabella ' + table
    });
  });
});

// API per PUT utilizzando payload
app.put('/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const payload = req.body.payload;

  // Costruisci la query e i valori dinamicamente
  const { query, values } = buildQuery(table, payload, id);

  // Esegui la query nel database
  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante l\'aggiornamento dei dati',
        error: err
      });
    }
    res.send({
      message: 'Dati aggiornati correttamente nella tabella ' + table
    });
  });
});


// CHECK SERVER
app.listen(3000, () => {
  console.log('Server running...');
});
