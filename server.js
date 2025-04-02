const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Подключение к базе

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Проверка и голосование
app.post('/api/vote', async (req, res) => {
  const { partyName, voterCode } = req.body;

  if (!partyName || !voterCode) {
    return res.status(400).json({ error: 'Необходимо указать партию и код' });
  }

  try {
    // Проверяем, есть ли код в базе и не использован ли он
    const voter = await db.query('SELECT * FROM voters WHERE code = $1 AND used = FALSE', [voterCode]);

    if (voter.rows.length === 0) {
      return res.status(403).json({ error: 'Неверный или уже использованный код' });
    }

    // Проверяем, есть ли партия в базе
    const party = await db.query('SELECT * FROM votes WHERE party_name = $1', [partyName]);

    if (party.rows.length > 0) {
      // Обновляем количество голосов
      await db.query('UPDATE votes SET vote_count = vote_count + 1 WHERE party_name = $1', [partyName]);
    } else {
      // Добавляем новую партию
      await db.query('INSERT INTO votes (party_name, vote_count) VALUES ($1, 1)', [partyName]);
    }

    // Обновляем код как использованный
    await db.query('UPDATE voters SET used = TRUE WHERE code = $1', [voterCode]);

    res.status(200).json({ message: `Голос за ${partyName} принят! ✅` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка базы данных' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
