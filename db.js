const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Имя пользователя PostgreSQL
  host: 'localhost',
  database: 'voting-system', // Имя базы данных
  password: '1q2w', // Пароль пользователя
  port: 5432, // Порт PostgreSQL
});

pool.connect()
  .then(() => console.log('✅ Подключение к базе данных установлено'))
  .catch(err => console.error('❌ Ошибка подключения к базе данных:', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
};
