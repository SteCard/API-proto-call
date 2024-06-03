const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dropfaci_arpab_2',
  port: process.env.DB_PORT || 3306
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

// app.post('/:tableName', (req, res) => {
//   const tableName = req.params.tableName;
//   const fields = req.body.fields;

//   // Function to handle different types of values
//   const formatValue = (value) => {
//     if (value === undefined || value === null) {
//       return 'NULL';
//     } else if (typeof value === 'string') {
//       return `'${value}'`;
//     } else if (typeof value === 'boolean') {
//       return value ? 1 : 0;
//     } else if (value instanceof Date) {
//       return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
//     } else {
//       return value;
//     }
//   };

//   // Function to format array values
//   const formatArrayValue = (value) => {
//     return Array.isArray(value) ? `(${value.map(val => formatValue(val)).join(', ')})` : formatValue(value);
//   };

//   const columns = Object.keys(fields).join(', ');
//   const values = Object.values(fields).map(value => formatArrayValue(value)).join(', ');

//   const qrInsert = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

//   db.query(qrInsert, (err, result) => {
//     if (err) {
//       console.log(err, 'Error during INSERT query');
//       return res.status(500).send({
//         message: 'Error during data insertion',
//         error: err
//       });
//     }
//     res.send({
//       message: `Data inserted successfully into table ${tableName}`
//     });
//   });
// });

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

/////

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
 
// API GET dei valori "classifcem" (200OK)
app.get('/classifcem', (req, res) => {
  let qr = `SELECT valoretemrum FROM classifcem`; 
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per le azioni',
        error: err
      });
    }
    res.send({
      message: 'Azioni recuperate correttamente',
      data: result
    });
  });
});

// API GET dei valori "codicesitogestori" (200OK)
app.get('/codicesitogestori', (req, res) => {
  let qr = `SELECT numcodsito FROM codicesitogestori`; 
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per i Numeri codice sito',
        error: err
      });
    }
    res.send({
      message: 'Numeri Codice Sito recuperato correttamente',
      data: result
    });
  });
});

// API GET dei valori "statoimpianto" (200OK)
app.get('/statoimpianto', (req, res) => {
  let qr = `SELECT valore FROM statoimpianto`; 
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per gli stati impianto',
        error: err
      });
    }
    res.send({
      message: 'Stati impianto recuperati correttamente',
      data: result
    });
  });
});

// API GET dei valori "statoprocedura" (200OK)
app.get('/statoprocedura', (req, res) => {
  let qr = `SELECT valore FROM statoprocedura`; 
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per gli stati procedura',
        error: err
      });
    }
    res.send({
      message: 'Stati procedura recuperati correttamente',
      data: result
    });
  });
});

////////////////////////////// PROTOCOLLO GEOS //////////////////////////////////////////
// API GET all data from "protocollocem" table - 200OK
app.get('/protocollogeos', (req, res) => {
  let qr = `SELECT * FROM protocollogeos`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Tutti i dati dalla tabella protocollogeos',
        data: result
      });
    }
  });
});

////////////////////////////// CODICE SITO GESTORI //////////////////////////////////////////
// API GET all data from "codicesitogestori" table - 200OK
app.get('/codicesitogestoriAll', (req, res) => {
  let qr = `SELECT * FROM codicesitogestori`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Tutti i dati dalla tabella codicesitogestori',
        data: result
      });
    }
  });
});

// API GET dei valori "gestori" (200OK)
app.get('/codicesitogestori/gestore', (req, res) => {
  let qr = `SELECT nomegestore FROM gestori`; 
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per i gestori',
        error: err
      });
    }
    res.send({
      message: 'Gestori recuperati correttamente',
      data: result
    });
  });
});

//// API form nidificato reg-prov-com ////
// API to GET regioni
app.get('/codicesitogestori/regione', (req, res) => {
  let qr = `SELECT codice_regione AS codice, denominazione_regione AS denominazione FROM gi_regioni`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per le regioni',
        error: err
      });
    }
    res.send({
      message: 'Regioni recuperate correttamente',
      data: result
    });
  });
});

// API to GET province by regione
app.get('/codicesitogestori/provincia', (req, res) => {
  const regioneCodice = req.query.regione;
  let qr = `SELECT sigla_provincia AS codice, denominazione_provincia AS denominazione FROM gi_province WHERE codice_regione = ?`;
  db.query(qr, [regioneCodice], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per le province',
        error: err
      });
    }
    res.send({
      message: 'Province recuperate correttamente',
      data: result
    });
  });
});

// API to GET comuni by provincia
app.get('/codicesitogestori/comune', (req, res) => {
  const provinciaSigla = req.query.provincia;
  let qr = `SELECT codice_istat AS codice, denominazione_ita AS denominazione FROM gi_comuni WHERE sigla_provincia = ?`;
  db.query(qr, [provinciaSigla], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante la query GET per i comuni',
        error: err
      });
    }
    res.send({
      message: 'Comuni recuperati correttamente',
      data: result
    });
  });
});
//// END API form nidificato reg-prov-com ////

// GET all values of the "protocollo" column (200OK)
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

////////////////////////////// SCHEDA RADIO ELETTRICA (CODICESITOGESTORI2) //////////////////////////////////////////
// API GET all data from "codicesitogestori2" table - 200OK
app.get('/codicesitogestori2All', (req, res) => {
  let qr = `SELECT * FROM codicesitogestori2`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Tutti i dati dalla tabella codicesitogestori2',
        data: result
      });
    }
  });
});

// API GET Numcodsito from "codicesitogestori" table - 200OK
app.get('/codicesitogestori/numcodsito', (req, res) => {
  let qr = `SELECT numcodsito FROM codicesitogestori`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Numcodsito dalla tabella codicesitogestori',
        data: result
      });
    }
  });
});

////////////////////////////// RILEVAZIONI SITO //////////////////////////////////////////
// API GET all data from "rilevazionisito" table - 200OK
app.get('/rilevazionisitoAll', (req, res) => {
  let qr = `SELECT * FROM rilevazionisito`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Dati recuperati dalla tabella rilevazionisito',
        data: result
      });
    }
  });
});

// API GET numcodsito from "rilevazionisito" table - 200OK
app.get('/rilevazionisito/numcodsito', (req, res) => {
  let qr = `SELECT numcodsito FROM rilevazionisito`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Tutti i dati dalla tabella rilevazionisito',
        data: result
      });
    }
  });
});

////////////////////////////// GESTORI CEM //////////////////////////////////////////
// API GET all data from "gestori" table - 200OK
app.get('/gestoriAll', (req, res) => {
  let qr = `SELECT * FROM gestori`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Tutti i dati dalla tabella gestori',
        data: result
      });
    }
  });
});

////////////////////////////// MISURE CEM //////////////////////////////////////////
// ???? WHICH TABLE ????
// API GET all data from "misurecem" table - 200OK
app.get('/misurecemAll', (req, res) => {
  let qr = `SELECT * FROM misurecem`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Tutti i dati dalla tabella misurecem',
        data: result
      });
    }
  });
});

////////////////////////////// SONDE STRUM //////////////////////////////////////////
// API GET all data from "sondestrum" table - 200OK
app.get('/sondestrumAll', (req, res) => {
  let qr = `SELECT * FROM sondestrum`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Tutti i dati dalla tabella sondestrum',
        data: result
      });
    }
  });
});

////////////////////////////// STRUMENTI CEM //////////////////////////////////////////
// API GET all data from "strumenticem" table - 200OK
app.get('/strumenticemAll', (req, res) => {
  let qr = `SELECT * FROM strumenticem`;
  db.query(qr, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query GET');
      res.status(500).send({
        message: 'Errore durante il recupero dei dati',
        error: err
      });
    } else {
      res.send({
        message: 'Tutti i dati dalla tabella strumenticem',
        data: result
      });
    }
  });
});

//////////////// GENERIC DELETE APIs  ///////////
// API DELETE single data for any table
app.delete('/:tableName/single', (req, res) => {
  const tableName = req.params.tableName;
  const primaryKey = req.query.primaryKey; // Assuming the primary key field name is provided as a query parameter
  const primaryKeyValue = req.query.primaryKeyValue; // Assuming the primary key value is provided as a query parameter

  if (!primaryKey || !primaryKeyValue) {
    return res.status(400).send({
      message: 'Il campo chiave primaria e il suo valore devono essere forniti come parametri di query'
    });
  }

  let qr = `DELETE FROM ${tableName} WHERE ${primaryKey} = ?`;
  db.query(qr, [primaryKeyValue], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante l\'eliminazione dei dati',
        error: err
      });
    }
    res.send({
      message: 'Dati eliminati con successo'
    });
  });
});

// API DELETE - Delete multiple data for any table
app.delete('/:tableName/multiple', (req, res) => {
  const tableName = req.params.tableName;
  const primaryKey = req.query.primaryKey; // Assuming the primary key field name is provided as a query parameter
  const primaryKeyValues = req.body; // Array of primary key values to delete

  if (!primaryKey || primaryKeyValues.length === 0) {
    return res.status(400).send({
      message: 'Il campo chiave primaria e almeno un valore devono essere forniti come parametri'
    });
  }

  let qr = `DELETE FROM ${tableName} WHERE ${primaryKey} IN (?)`;

  db.query(qr, [primaryKeyValues], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante l\'eliminazione dei dati',
        error: err
      });
    }
    res.send({
      message: 'Dati eliminati con successo'
    });
  });
});


// CHECK SERVER
app.listen(3000, () => {
  console.log('Server running...');
});
