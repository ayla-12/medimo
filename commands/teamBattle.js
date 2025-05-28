const { db } = require('../db/database');

async function getTeamRanking() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT role_name, SUM(duration) AS total_seconds
      FROM voice_logs
      WHERE timestamp >= datetime('now', '-7 days')
        AND role_name IS NOT NULL
        AND role_name != ''
      GROUP BY role_name
      ORDER BY total_seconds DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) return reject(err);

      if (rows.length === 0) {
        return resolve('😢 지난 일주일간 팀 기록이 없어요!');
      }

      const result = rows
        .map((row, index) => `${index + 1}위. ${row.role_name} — ${Math.floor(row.total_seconds / 60)}분`)
        .join('\n');

      resolve(`🏆 **팀별 대전 (최근 7일 기준)**\n\n${result}`);
    });
  });
}

module.exports = {
  name: '!팀별대전',
  execute: async (message) => {
    const ranking = await getTeamRanking();
    message.channel.send(ranking);
  },
};
