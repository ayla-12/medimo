const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Railway에서 SSL 필요함
  },
});

// 음성 로그 저장 함수
async function saveVoiceLog(userId, username, roleName, duration) {
  const query = `
    INSERT INTO voice_logs (user_id, username, role_name, duration)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [userId, username, roleName, duration];

  try {
    await pool.query(query, values);
    console.log(`📥 저장 완료: ${username} - ${duration}초`);
  } catch (err) {
    console.error('❌ 로그 저장 실패:', err.message);
  }
}

module.exports = {
  saveVoiceLog,
  query: (text, params) => pool.query(text, params),
};
