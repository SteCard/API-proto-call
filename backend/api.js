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

/////////////////////// GENERIC POST+PUT APIs ///////////////////////
// API POST - Insert data in DB - GENERIC FORM
app.post('/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  const columns = Object.keys(req.body.fields).join(', ');
  const values = Object.values(req.body.fields).map(value => {
    if (value === undefined || value === null) {
      return 'NULL';
    } else if (typeof value === 'string') {
      return `'${value}'`;
    } else if (typeof value === 'boolean') {
      return value ? 1 : 0;
    } else if (value instanceof Date) {
      return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
    } else {
      return value;
    }
  }).join(', ');

  const qrInsert = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

  db.query(qrInsert, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query INSERT');
      return res.status(500).send({
        message: 'Errore durante l\'inserimento dei dati',
        error: err
      });
    }
    res.send({
      message: `Dati inseriti correttamente nella tabella ${tableName}`
    });
  });
});

// API PUT - Update data for a specific table and ID
app.put('/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  const idFieldName = Object.keys(req.query)[0]; // Assuming only one query parameter is provided for ID
  const idFieldValue = req.query[idFieldName]; // Value of the ID field
  const fieldsToUpdate = req.body.fields;

  if (!idFieldName || !idFieldValue) {
    return res.status(400).send({ message: 'Il campo ID e il suo valore devono essere forniti come parametro di query' });
  }

  if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).send({ message: 'Il corpo della richiesta non contiene dati validi per l\'aggiornamento' });
  }

  const columnsToUpdate = Object.keys(fieldsToUpdate).map(column => `${column} = ?`).join(', ');
  const valuesToUpdate = Object.values(fieldsToUpdate);

  const updateQuery = `UPDATE ${tableName} SET ${columnsToUpdate} WHERE ${idFieldName} = ?`;

  db.query(updateQuery, [...valuesToUpdate, idFieldValue], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante l\'aggiornamento dei dati',
        error: err
      });
    }
    res.send({
      message: 'Dati aggiornati correttamente'
    });
  });
});

////////////////////////////// PROTOCOLLO CEM //////////////////////////////////////////
// API GET all data from "protocollocem" table - 200OK
app.get('/protocollocem', (req, res) => {
  let qr = `SELECT * FROM protocollocem`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Tutti i dati dalla tabella protocollocem',
        data: result
      });
    }
  });
});

// API GET all values of the "protocollo" column (200OK)
app.get('/protocollocem/protocolli', (req, res) => {
  let qr = `SELECT protocollo FROM protocollocem`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET per i valori di "protocollo"');
      return res.status(500).send({
        message: 'Errore durante il recupero dei valori di "protocollo"',
        error: err
      });
    }
    res.send({
      message: 'Valori di "protocollo" recuperati correttamente',
      data: result
    });
  });
});

// API GET dei valori "subassegnazione" (200OK)
app.get('/operatori', (req, res) => {
  let qr = `SELECT nomeoperatore FROM operatori`; 
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per gli operatori',
        error: err
      });
    }
    res.send({
      message: 'operatori recuperati correttamente',
      data: result
    });
  });
});

// API GET data for "senso" dropdown (200OK)
app.get('/senso', (req, res) => {
  let qr = `SELECT valore FROM senso`; // Seleziona solo la colonna "valore"
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per i valori di "senso"',
        error: err
      });
    }
    res.send({
      message: 'Dati "senso" recuperati correttamente',
      data: result
    });
  });
});

/// TEMATICHE CATEGORIE SOTTOCATEGORIE ///
// API to GET tematiche
app.get('/tematica', (req, res) => {
  let qr = `SELECT idtematiche AS codice, tipotematica AS denominazione FROM tematiche`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per le tematiche',
        error: err
      });
    }
    res.send({
      message: 'Tematiche recuperate correttamente',
      data: result
    });
  });
});

// API to GET categorie by tematica
app.get('/categoria', (req, res) => {
  const tematicaCodice = req.query.tematica;
  let qr = `SELECT idcat AS codice, tipocategoria AS denominazione FROM categorieall WHERE idtematiche = ?`;
  db.query(qr, [tematicaCodice], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per le categorie',
        error: err
      });
    }
    res.send({
      message: 'Categorie recuperate correttamente',
      data: result
    });
  });
});

// API to GET sottocategorie by categoria
app.get('/sottocategoria', (req, res) => {
  const categoriaId = req.query.categoria;
  let qr = `SELECT idsotcat AS codice, tiposotcat AS denominazione FROM sottocategorieall WHERE idcat = ?`;
  db.query(qr, [categoriaId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per le sottocategorie',
        error: err
      });
    }
    res.send({
      message: 'Sottocategorie recuperate correttamente',
      data: result
    });
  });
});

// API GET dei valori "catcem" (200OK)
app.get('/catcem', (req, res) => {
  let qr = `SELECT catcem FROM catcem`; 
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per le categorie',
        error: err
      });
    }
    res.send({
      message: 'Categorie recuperate correttamente',
      data: result
    });
  });
});

// API GET dei valori "sottcatcem" (200OK)
app.get('/sottcatcem', (req, res) => {
  let qr = `SELECT valoretemrum FROM sottcatcem`; 
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per le sottocategorie',
        error: err
      });
    }
    res.send({
      message: 'Sottocategorie recuperate correttamente',
      data: result
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000...');
});
