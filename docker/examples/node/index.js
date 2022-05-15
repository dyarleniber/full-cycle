const express = require('express');
const mysql = require('mysql')

const app = express();
const port = 3000;
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database:'nodedb'
};

const connection = mysql.createConnection(config)
const sql = `INSERT INTO people(name) values('John')`
connection.query(sql)
connection.end()

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Running on port ${port}.`));
