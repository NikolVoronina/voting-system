const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1q2w',  
  database: 'voting-system'
});

client.connect();

module.exports = client;
