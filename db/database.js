const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// DB 파일 경로 (프로젝트 루트에 voice_logs.db로 생성됨)
const dbPath = path.resolve(__dirname, 'voice_logs.db');

// DB 연결
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ 데이터베이스 연결 실패:', err.message);
  } else {
    console.log('✅ SQLite 데이터베이스 연결됨');
  }
});

// 테이블이 없다면 생성
db.run(`
  CREATE TABLE IF NOT EXISTS voice_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    role_name TEXT,
    duration INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function saveVoiceLog(userId, username, roleName, duration) {
  const query = `
    INSERT INTO voice_logs (user_id, username, role_name, duration)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [userId, username, roleName, duration], function (err) {
    if (err) {
      console.error('❌ 로그 저장 실패:', err.message);
    } else {
      console.log(`📥 저장 완료: ${username} - ${duration}초`);
    }
  });
}

module.exports = {
  saveVoiceLog,
  db // 필요하면 다른 모듈에서도 쓸 수 있도록 내보냄
};
