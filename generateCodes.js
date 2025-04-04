const { Client } = require('pg');

// Подключение к базе данных
const client = new Client({
  host: 'localhost',
  port: 5432,  // Порт для PostgreSQL
  user: 'postgres',
  password: '1q2w',  
  database: 'voting-system'
});

client.connect();

// Генерация случайного кода (6 символов)
async function generateRandomCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Генерация случайной даты рождения (от 1980 до 2005 года), меняем местами день и месяц
function generateRandomBirthDate() {
  const startYear = 1980;
  const endYear = 2005;

  // Генерируем случайный день, месяц и год
  const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const randomMonth = Math.floor(Math.random() * 12); // Месяц от 0 до 11
  const daysInMonth = new Date(randomYear, randomMonth + 1, 0).getDate(); // Количество дней в месяце
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1; // Случайный день

  // Формируем строку в формате "Месяц-День-Год"
  const birthDate = new Date(randomYear, randomMonth, randomDay)
    .toISOString()
    .split('T')[0];

  // Возвращаем в формате "MM-DD-YYYY"
  return `${birthDate.split('-')[1]}-${birthDate.split('-')[2]}-${birthDate.split('-')[0]}`;
}

// Добавление кода в базу данных
async function addCodeToDatabase(code, birthDate) {
  try {
    const result = await client.query('SELECT * FROM voters WHERE code = $1', [code]);
    if (result.rows.length === 0) {
      await client.query('INSERT INTO voters (code, birth_date, used) VALUES ($1, $2, FALSE)', [code, birthDate]);
      console.log(`✅ Код добавлен: ${code}, Дата рождения: ${birthDate}`);
      return true;
    } else {
      console.log(`⚠️ Код ${code} уже существует. Генерируем новый.`);
      return false;
    }
  } catch (err) {
    console.error('❌ Ошибка при добавлении в базу:', err);
    return false;
  }
}

// Генерация нескольких кодов и добавление в базу
async function addCodes(count = 10) {
  try {
    let addedCount = 0;

    while (addedCount < count) {
      const code = await generateRandomCode(); // Генерация кода
      const birthDate = generateRandomBirthDate(); // Генерация даты рождения
      const success = await addCodeToDatabase(code, birthDate);
      if (success) {
        addedCount++;
      }
    }

    console.log('🎉 Все коды успешно добавлены!');
  } catch (err) {
    console.error('❌ Ошибка при добавлении кодов:', err);
  } finally {
    await client.end();
  }
}

// Запуск генерации кодов
addCodes(10);
