const { Client } = require('pg');

// Создание нового клиента для подключения к базе данных
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'voting-system',
  password: '1q2w',
  port: 5432,
});

async function generateRandomCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Функция для добавления кода в базу данных с проверкой на уникальность
async function addCodeToDatabase(code) {
  try {
    const result = await client.query('SELECT * FROM voters WHERE code = $1', [code]);
    if (result.rows.length === 0) {
      // Если код не существует в базе, добавляем его
      await client.query('INSERT INTO voters (code) VALUES ($1)', [code]);
      console.log(`Код добавлен: ${code}`);
    } else {
      console.log(`Код ${code} уже существует. Генерируем новый.`);
      return false;  // Код уже существует, необходимо сгенерировать новый
    }
  } catch (err) {
    console.error('❌ Ошибка при добавлении кода в базу:', err);
  }
  return true;  // Код был успешно добавлен
}

async function addCodes(count = 10) {
  try {
    await client.connect();  // Подключаемся к базе данных
    let addedCount = 0;

    while (addedCount < count) {
      const code = generateRandomCode();
      const success = await addCodeToDatabase(code);
      if (success) {
        addedCount++;
      }
    }

    console.log('✅ Все коды успешно добавлены!');
  } catch (err) {
    console.error('❌ Ошибка при добавлении кодов:', err);
  } finally {
    await client.end();  // Завершаем подключение к базе данных
  }
}

addCodes(10);  // Генерируем 10 кодов
