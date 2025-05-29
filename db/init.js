const { query } = require('./database');

const createTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS voice_logs (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL,
      role_name TEXT,
      duration INTEGER NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(sql);
    console.log('✅ PostgreSQL voice_logs 테이블 생성 완료!');
  } catch (err) {
    console.error('❌ 테이블 생성 실패:', err.message);
  }
};

createTable();
