const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Импортируем CORS
const db = require('./db'); // Подключение к базе

const app = express();
const port = 5050;

// Разрешаем CORS только для вашего фронтенда (если он работает на другом порту, например, 3000):
app.use(cors({
  origin: 'http://localhost:3000'  // Указываем порт фронтенда (он должен быть на порту 3000)
}));

app.use(bodyParser.json());
app.use(express.static('public'));

// Маршрут голосования
app.post('/api/vote', async (req, res) => {
  console.log("Получен запрос:", req.body);  // Логируем весь запрос
  const { voterCode, birthDate, partyName } = req.body;

  // Проверяем, что все данные получены
  if (!voterCode || !birthDate || !partyName) {
    console.error("Недостаточно данных для голосования.");
    return res.status(400).json({ error: "Недостаточно данных для голосования" });
  }

  console.log(`Код: ${voterCode}, Дата рождения: ${birthDate}, Партия: ${partyName}`);

  try {
    // Замените запрос на подходящий для вашей базы данных, если нужно
    const result = await db.query(
      'UPDATE voters SET party_name = $1 WHERE code = $2 AND birth_date = $3',
      [partyName, voterCode, birthDate]
    );

    if (result.rowCount > 0) {
      console.log("Голос успешно зарегистрирован!");
      return res.json({ message: 'Stemmen din har blitt tatt i betraktning!' });
    } else {
      console.log("Невозможно найти избирателя с таким кодом и датой рождения.");
      return res.status(400).json({ error: 'Ошибка при голосовании. Пожалуйста, проверьте данные.' });
    }
  } catch (err) {
    console.error("Ошибка базы данных:", err);
    return res.status(500).json({ error: 'Ошибка сервера: ' + err.message });
  }
});

app.get("/api/parties", async (req, res) => {
  try {
    const parties = await prisma.votes.findMany({
      select: { party_name: true },
    });
    res.json(parties);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении партий" });
  }
});


// Запуск сервера
app.listen(port, () => {
  console.log(`✅✅✅✅✅✅ http://localhost:${port}`);
});

