const express = require('express');
const mysql = require('mysql');
const chance = require('chance').Chance();

const app = express();
const port = 3000;
const dbConfig = {
  host: 'dyarleniber_node_db',
  user: 'root',
  password: 'root',
  database:'node_db'
};

const connection = mysql.createConnection(dbConfig);

const logDbQueryError = (err) => { if (err) console.log(err); }
const dbQuery = (query, callback = logDbQueryError) => {
  connection.query(query, callback);
};

dbQuery(`CREATE TABLE IF NOT EXISTS people (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255),
  PRIMARY KEY (id)
);`);


app.get('/', (req, res) => {
  const name = chance.name();
  dbQuery(`INSERT INTO people(name) values('${name}')`);
  dbQuery(`SELECT * FROM people`, (error, results) => {
    if (error) throw error;
    res.send(`
        <h1>Full Cycle Rocks!</h1>
        <ul>
            ${results.map(result => `<li>${result.name}</li>`).join("")}
        </ul>
    `);
  });
});

app.listen(port, () => console.log(`Running on port ${port}.`));
