const { db } = require("../db/database");

async function getMyStats(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        SUM(CASE WHEN timestamp >= datetime('now', '-1 day') THEN duration ELSE 0 END) AS day,
        SUM(CASE WHEN timestamp >= datetime('now', '-7 days') THEN duration ELSE 0 END) AS week,
        SUM(CASE WHEN timestamp >= datetime('now', '-30 days') THEN duration ELSE 0 END) AS month
      FROM voice_logs
      WHERE user_id = ?
    `;

    db.get(query, [userId], (err, row) => {
      if (err) return reject(err);

      const dayMin = Math.floor((row.day || 0) / 60);
      const weekMin = Math.floor((row.week || 0) / 60);
      const monthMin = Math.floor((row.month || 0) / 60);

      const result = `🧑‍💻 **나의 공부시간 요약**

📅 오늘: ${dayMin}분  
📆 이번 주: ${weekMin}분  
🗓️ 이번 달: ${monthMin}분`;

      resolve(result);
    });
  });
}

module.exports = {
  name: "!나의공부시간",
  execute: async (message) => {
    const userId = message.author.id;
    const stats = await getMyStats(userId);
    message.channel.send(stats);
  },
};
