const db = require("../db/database");

module.exports = {
  name: "!나의공부시간",
  execute: async (message) => {
    const userId = message.author.id;

    try {
      const query = `
        SELECT
          SUM(CASE WHEN timestamp >= NOW() - INTERVAL '1 day' THEN duration ELSE 0 END) AS day,
          SUM(CASE WHEN timestamp >= NOW() - INTERVAL '7 days' THEN duration ELSE 0 END) AS week,
          SUM(CASE WHEN timestamp >= NOW() - INTERVAL '30 days' THEN duration ELSE 0 END) AS month
        FROM voice_logs
        WHERE user_id = $1
      `;

      const result = await db.query(query, [userId]);
      const row = result.rows[0];

      const dayMin = Math.floor((row.day || 0) / 60);
      const weekMin = Math.floor((row.week || 0) / 60);
      const monthMin = Math.floor((row.month || 0) / 60);

      const statsMessage = `🧑‍💻 **나의 공부시간 요약**

📅 오늘: ${dayMin}분  
📆 이번 주: ${weekMin}분  
🗓️ 이번 달: ${monthMin}분`;

      message.channel.send(statsMessage);
    } catch (err) {
      console.error("❌ 나의공부시간 오류:", err.message);
      message.channel.send("공부시간 정보를 불러오는 중 오류가 발생했어요.");
    }
  },
};
