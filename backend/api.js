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

// GET all data from "protocollocem" table - 200OK
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

// GET data with optional limit - 200OK
// app.get('/protocollocem', (req, res) => {
//   const limit = req.query.limit || 10; // Default limit is 10 if not provided
//   let qr = `SELECT * FROM protocollocem LIMIT ${limit}`;
//   db.query(qr, (err, result) => {
//       if (err) {
//           console.log(err, 'Errore durante la query GET');
//           res.status(500).send({
//               message: 'Errore durante il recupero dei dati',
//               error: err
//           });
//       } else {
//           res.send({
//               message: `Primi ${limit} dati`,
//               data: result
//           });
//       }
//   });
// });

// GET data for "senso" dropdown (200OK)
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

// POST - Create data for protocollocem
app.post('/protocollocem', (req, res) => {
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

  // Check if protocollo already exists
  let qrCheckProtocollo = `SELECT * FROM protocollocem WHERE protocollo = ?`;
  db.query(qrCheckProtocollo, [protocollo], (err, result) => {
    if (err) {
      console.log(err, 'Errore durante la query SELECT');
      return res.status(500).send({
        message: 'Errore durante la verifica del numero di protocollo',
        error: err
      });
    }
    if (result.length > 0) {
      return res.status(400).send({
        message: 'Numero di protocollo già esistente. Inserire un numero diverso.'
      });
    }

    // Insert data into the database
    let qrInsert = `INSERT INTO protocollocem (senso, data, protocollo, autore, mittente, destinatario, oggetto, numprotcoll, riscontrogeos, subassegnazione, note, tematica, categoria, sottocategoria, azione, azionedup, protriferime, aie, congiunta, simulazione, numcodsito, statoimpianto, statoprocedura, scadenza, scadenza2, cdsdata, cdsora, notadigos, dirigente, funzionario, commriscontro) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(qrInsert, [senso, data, protocollo, autore, mittente, destinatario, oggetto, numprotcoll, riscontrogeos, subassegnazione, note, tematica, categoria, sottocategoria, azione, azionedup, protriferime, aie, congiunta, simulazione, numcodsito, statoimpianto, statoprocedura, scadenza, scadenza2, cdsdata, cdsora, notadigos, dirigente, funzionario, commriscontro], (err, result) => {
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
});

// PUT - Update data for protocollocem
app.put('/protocollocem', (req, res) => {
  const idprot = req.query.idprot; // Otteniamo l'ID del protocollo dalla query string
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
      message: 'Data updated'
    });
  });
});


// PUT - Update data for protocollocem (200OK)
// app.put('/protocollocem/:idprot', (req, res) => {
//   const idprot = req.params.idprot;
//   const {
//     senso,
//     data,
//     protocollo,
//     autore,
//     mittente,
//     destinatario,
//     oggetto,
//     numprotcoll,
//     riscontrogeos,
//     subassegnazione,
//     note,
//     tematica,
//     categoria,
//     sottocategoria,
//     azione,
//     azionedup,
//     protriferime,
//     aie,
//     congiunta,
//     simulazione,
//     numcodsito,
//     statoimpianto,
//     statoprocedura,
//     scadenza,
//     scadenza2,
//     cdsdata,
//     cdsora,
//     notadigos,
//     dirigente,
//     funzionario,
//     commriscontro
//   } = req.body;

//   let qr = `UPDATE protocollocem 
//             SET senso=?, data=?, protocollo=?, autore=?, mittente=?, destinatario=?, oggetto=?, numprotcoll=?, riscontrogeos=?, subassegnazione=?, note=?, tematica=?, categoria=?, sottocategoria=?, azione=?, azionedup=?, protriferime=?, aie=?, congiunta=?, simulazione=?, numcodsito=?, statoimpianto=?, statoprocedura=?, scadenza=?, scadenza2=?, cdsdata=?, cdsora=?, notadigos=?, dirigente=?, funzionario=?, commriscontro=?
//             WHERE idprot=?`;
//   db.query(qr, [senso, data, protocollo, autore, mittente, destinatario, oggetto, numprotcoll, riscontrogeos, subassegnazione, note, tematica, categoria, sottocategoria, azione, azionedup, protriferime, aie, congiunta, simulazione, numcodsito, statoimpianto, statoprocedura, scadenza, scadenza2, cdsdata, cdsora, notadigos, dirigente, funzionario, commriscontro, idprot], (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).send({
//         message: 'Error occurred while updating data',
//         error: err
//       });
//     }
//     res.send({
//       message: 'Data updated'
//     });
//   });
// });

// Delete single data
app.delete('/protocollocem', (req, res) => {
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

// Delete single data (200OK)
// app.delete('/protocollocem/:idprot', (req, res) => {
//   const idprot = req.params.idprot;
//   let qr = `DELETE FROM protocollocem WHERE idprot = ?`;
//   db.query(qr, [idprot], (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).send({
//         message: 'Error occurred while deleting data',
//         error: err
//       });
//     }
//     res.send({
//       message: 'Data deleted'
//     });
//   });
// });

//API form nidificato reg-prov-com

// API to GET regioni
app.get('/gi_regioni', (req, res) => {
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
app.get('/gi_province', (req, res) => {
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
app.get('/gi_comuni', (req, res) => {
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

// POST - Create data for codicesitogestori
// app.post('/codicesitogestori', (req, res) => {
//   const { numcodsito, nomesito, regione, provincia, comune } = req.body;

//   let qrInsert = `INSERT INTO codicesitogestori (numcodsito, nomesito, regione, provincia, comune) 
//                   VALUES (?, ?, ?, ?, ?)`;
//   db.query(qrInsert, [numcodsito, nomesito, regione, provincia, comune], (err, result) => {
//     if (err) {
//       console.log(err, 'Errore durante la query INSERT');
//       return res.status(500).send({
//         message: 'Errore durante l\'inserimento dei dati',
//         error: err
//       });
//     }
//     res.send({
//       message: 'Dati inseriti correttamente nella tabella codicesitogestori'
//     });
//   });
// });

app.post('/codicesitogestori', (req, res) => {
  const { numcodsito, nomesito, regione, provincia, comune } = req.body;

  // Funzione per ottenere la denominazione della regione basata sul codice
  const getRegionName = (regione, callback) => {
    db.query('SELECT denominazione_regione FROM gi_regioni WHERE codice_regione = ?', [regione], (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result[0].denominazione_regione);
      }
    });
  };

  // Funzione per ottenere la denominazione del comune basata sul codice
  const getComuneName = (comune, callback) => {
    db.query('SELECT denominazione_ita FROM gi_comuni WHERE codice_istat = ?', [comune], (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result[0].denominazione_ita);
      }
    });
  };

  // Inserimento dei dati nella tabella codicesitogestori
  getRegionName(regione, (err, regionName) => {
    if (err) {
      console.log(err, 'Errore durante la ricerca della denominazione della regione');
      return res.status(500).send({
        message: 'Errore durante la ricerca della denominazione della regione',
        error: err
      });
    }

    getComuneName(comune, (err, comuneName) => {
      if (err) {
        console.log(err, 'Errore durante la ricerca della denominazione del comune');
        return res.status(500).send({
          message: 'Errore durante la ricerca della denominazione del comune',
          error: err
        });
      }

      // Inserimento dei dati nella tabella codicesitogestori con le denominazioni al posto dei codici
      let qrInsert = `INSERT INTO codicesitogestori (numcodsito, nomesito, regione, provincia, comune) 
                      VALUES (?, ?, ?, ?, ?)`;
      db.query(qrInsert, [numcodsito, nomesito, regionName, provincia, comuneName], (err, result) => {
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
  });
});

// CHECK SERVER
app.listen(3000, () => {
  console.log('Server running...');
});
