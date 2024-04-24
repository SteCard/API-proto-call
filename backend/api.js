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


// API GET dei valori "tematica" (200OK)
app.get('/tematiche', (req, res) => {
  let qr = `SELECT tipotematica FROM tematiche`; 
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
  let qr = `SELECT numcodsito  FROM codicesitogestori`; 
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

// API POST - Insert data in DB - FORM
app.post('/protocollocem', (req, res) => {
  const columns = Object.keys(req.body).join(', ');
  const values = Object.values(req.body).map(value => {
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

  const qrInsert = `INSERT INTO protocollocem (${columns}) VALUES (${values})`;

  db.query(qrInsert, (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query INSERT');
      return res.status(500).send({
        message: 'Errore durante l\'inserimento dei dati',
        error: err
      });
    }
    res.send({
      message: 'Dati inseriti correttamente nella tabella protocollocem'
    });
  });
});

// API PUT - Update data for protocollocem
app.put('/protocollocem', (req, res) => {
  const idprot = req.query.idprot; // Otteniamo l'ID del protocollo dalla query params
  const {
    senso,
    data,
    protocollo,
    autore,
    mittente,
    destinatario,
    oggetto,
    numprotcoll,
    riscontrogeos,
    subassegnazione,
    note,
    tematica,
    categoria,
    sottocategoria,
    azione,
    azionedup,
    protriferime,
    aie,
    congiunta,
    simulazione,
    numcodsito,
    statoimpianto,
    statoprocedura,
    scadenza,
    scadenza2,
    cdsdata,
    cdsora,
    notadigos,
    dirigente,
    funzionario,
    commriscontro
  } = req.body;

  let qr = `UPDATE protocollocem 
            SET senso=?, data=?, protocollo=?, autore=?, mittente=?, destinatario=?, oggetto=?, numprotcoll=?, riscontrogeos=?, subassegnazione=?, note=?, tematica=?, categoria=?, sottocategoria=?, azione=?, azionedup=?, protriferime=?, aie=?, congiunta=?, simulazione=?, numcodsito=?, statoimpianto=?, statoprocedura=?, scadenza=?, scadenza2=?, cdsdata=?, cdsora=?, notadigos=?, dirigente=?, funzionario=?, commriscontro=?
            WHERE idprot=?`;
  db.query(qr, [senso, data, protocollo, autore, mittente, destinatario, oggetto, numprotcoll, riscontrogeos, subassegnazione, note, tematica, categoria, sottocategoria, azione, azionedup, protriferime, aie, congiunta, simulazione, numcodsito, statoimpianto, statoprocedura, scadenza, scadenza2, cdsdata, cdsora, notadigos, dirigente, funzionario, commriscontro, idprot], (err, result) => {
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

// API DELETE single data
app.delete('/protocollocem/single', (req, res) => {
  const idprot = req.query.idprot; // Otteniamo l'ID del protocollo dalla query string
  let qr = `DELETE FROM protocollocem WHERE idprot = ?`;
  db.query(qr, [idprot], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante l\'eliminazione dei dati',
        error: err
      });
    }
    res.send({
      message: 'Data deleted'
    });
  });
});

// API DELETE - Delete multiple data
app.delete('/protocollocem/multiple', (req, res) => {
  const idProts = req.body; // Array of protocol IDs to delete

  if (!idProts || idProts.length === 0) {
    return res.status(400).send({
      message: 'Nessun ID protocollo fornito nella richiesta'
    });
  }

  let qr = `DELETE FROM protocollocem WHERE idprot IN (?)`;

  db.query(qr, [idProts], (err, result) => {
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

// API POST - Insert data in codicesitogestori
app.post('/codicesitogestoriAll', (req, res) => {
  const {
    numcodsito,
    numcodsitoold,
    nomesito,
    gestore,
    tipoimpianto,
    regione,
    provincia,
    comune,
    indirizzo,
    numlocosscem,
    locosscem,
    coordinatelong,
    coordinatelat,
    protocollocheck,
    protcoll,
    linkcondivisia,
    dataprot,
    statoimpianto
  } = req.body;

  // Verifica se i valori richiesti sono stati forniti nel corpo della richiesta
  if (!numcodsito || !numcodsitoold || !nomesito || !gestore) {
    return res.status(400).send({
      message: 'I campi numcodsito, numcodsitoold, nomesito e gestore sono obbligatori'
    });
  }

  const qrInsert = `INSERT INTO codicesitogestori 
                    (numcodsito, numcodsitoold, nomesito, gestore, tipoimpianto, regione, provincia, comune, indirizzo, numlocosscem, locosscem, coordinatelong, coordinatelat, protocollocheck, protcoll, linkcondivisia, dataprot, statoimpianto) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(qrInsert, [numcodsito, numcodsitoold, nomesito, gestore, tipoimpianto, regione, provincia, comune, indirizzo, numlocosscem, locosscem, coordinatelong, coordinatelat, protocollocheck, protcoll, linkcondivisia, dataprot, statoimpianto], (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query INSERT');
      return res.status(500).send({
        message: 'Errore durante l\'inserimento dei dati',
        error: err
      });
    }
    res.send({
      message: 'Dati inseriti correttamente nella tabella codicesitogestori'
    });
  });
});

// API PUT - Update data for codicesitogestori
app.put('/codicesitogestori', (req, res) => {
  const numcodsito = req.query.numcodsito; // Otteniamo il valore di numcodsito dalla query params
  const {
    numcodsitoold,
    nomesito,
    gestore,
    tipoimpianto,
    regione,
    provincia,
    comune,
    indirizzo,
    numlocosscem,
    locosscem,
    coordinatelong,
    coordinatelat,
    protocollocheck,
    protcoll,
    linkcondivisia,
    dataprot,
    statoimpianto
  } = req.body;

  let qr = `UPDATE codicesitogestori 
            SET numcodsitoold=?, nomesito=?, gestore=?, tipoimpianto=?, regione=?, provincia=?, comune=?, indirizzo=?, numlocosscem=?, locosscem=?, coordinatelong=?, coordinatelat=?, protocollocheck=?, protcoll=?, linkcondivisia=?, dataprot=?, statoimpianto=?
            WHERE numcodsito=?`;
  db.query(qr, [numcodsitoold, nomesito, gestore, tipoimpianto, regione, provincia, comune, indirizzo, numlocosscem, locosscem, coordinatelong, coordinatelat, protocollocheck, protcoll, linkcondivisia, dataprot, statoimpianto, numcodsito], (err, result) => {
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

// API DELETE single data
app.delete('/codicesitogestori/single', (req, res) => {
  const numcodsito = req.query.numcodsito; // Otteniamo l'ID del numcodsito dalla query string
  let qr = `DELETE FROM codicesitogestori WHERE numcodsito = ?`;
  db.query(qr, [numcodsito], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: 'Errore durante l\'eliminazione dei dati',
        error: err
      });
    }
    res.send({
      message: 'Data deleted'
    });
  });
});

// API DELETE - Delete multiple data
app.delete('/codicesitogestori/multiple', (req, res) => {
  const numcodsito = req.body; // Array of numcodsito to delete

  if (!numcodsito || numcodsito.length === 0) {
    return res.status(400).send({
      message: 'Nessun numcodsito fornito nella richiesta'
    });
  }

  let qr = `DELETE FROM codicesitogestori WHERE numcodsito IN (?)`;

  db.query(qr, [numcodsito], (err, result) => {
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
