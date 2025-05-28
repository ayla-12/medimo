const { db } = require('../db/database');

async function getWeeklyRanking() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT username, SUM(duration) AS total_seconds
      FROM voice_logs
      WHERE timestamp >= datetime('now', '-7 days')
      GROUP BY user_id
      ORDER BY total_seconds DESC
      LIMIT 10
    `;

    db.all(query, [], (err, rows) => {
      if (err) return reject(err);

      if (rows.length === 0) {
        return resolve('🥲 지난 일주일간 기록이 없어요!');
      }

      const result = rows
        .map((row, index) => `${index + 1}위. ${row.username} — ${Math.floor(row.total_seconds / 60)}분`)
        .join('\n');

      resolve(`📅 **주간 공부 랭킹 (최근 7일)**\n\n${result}`);
    });
  });
}

module.exports = {
  name: '!주간랭킹',
  execute: async (message) => {
    const ranking = await getWeeklyRanking();
    message.channel.send(ranking);
  },
};
