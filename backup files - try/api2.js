const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

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

// Generic GET endpoint for tables with id as query parameter
app.get('/:table', (req, res) => {
  const table = req.params.table;
  const idName = `${table.substring(0, table.length - 1)}id`; // Assuming table name ends with 's' like 'protocollocem'

  const id = req.query[idName];
  if (!id) {
    return res.status(400).send({
      message: `ID parameter (${idName}) is missing`
    });
  }

  let qr = `SELECT * FROM ${table} WHERE ${idName} = ?`;
  db.query(qr, [id], (err, result) => {
    if (err) {
      console.log(err, `Errore durante la query GET per ${table}`);
      return res.status(500).send({
        message: `Errore durante il recupero dei dati da ${table}`,
        error: err
      });
    }
    if (result.length === 0) {
      return res.status(404).send({
        message: `Dati non trovati per l'ID fornito in ${table}`
      });
    }
    res.send({
      message: `Dati trovati per l'ID fornito in ${table}`,
      data: result[0]
    });
  });
});

// Generic POST endpoint for tables
app.post('/:table', (req, res) => {
  const table = req.params.table;
  const idName = `${table.substring(0, table.length - 1)}id`;

  const data = req.body;

  let qrInsert = `INSERT INTO ${table} SET ?`;
  db.query(qrInsert, data, (err, result) => {
    if (err) {
      console.log(err, `Errore durante la query INSERT per ${table}`);
      return res.status(500).send({
        message: `Errore durante l'inserimento dei dati in ${table}`,
        error: err
      });
    }
    res.send({
      message: `Dati inseriti correttamente nella tabella ${table}`
    });
  });
});

// Generic PUT endpoint for tables
app.put('/:table/:id', (req, res) => {
  const table = req.params.table;
  const idName = `${table.substring(0, table.length - 1)}id`;
  const id = req.params.id;
  const data = req.body;

  let qrUpdate = `UPDATE ${table} SET ? WHERE ${idName} = ?`;
  db.query(qrUpdate, [data, id], (err, result) => {
    if (err) {
      console.log(err, `Errore durante la query UPDATE per ${table}`);
      return res.status(500).send({
        message: `Errore durante l'aggiornamento dei dati in ${table}`,
        error: err
      });
    }
    res.send({
      message: `Dati aggiornati correttamente nella tabella ${table}`
    });
  });
});

// Generic DELETE endpoint for tables
app.delete('/:table/:id', (req, res) => {
  const table = req.params.table;
  const idName = `${table.substring(0, table.length - 1)}id`;
  const id = req.params.id;

  let qrDelete = `DELETE FROM ${table} WHERE ${idName} = ?`;
  db.query(qrDelete, [id], (err, result) => {
    if (err) {
      console.log(err, `Errore durante la query DELETE per ${table}`);
      return res.status(500).send({
        message: `Errore durante l'eliminazione dei dati da ${table}`,
        error: err
      });
    }
    res.send({
      message: `Dati eliminati correttamente dalla tabella ${table}`
    });
  });
});

// CHECK SERVER
app.listen(3000, () => {
  console.log('Server running...');
});
