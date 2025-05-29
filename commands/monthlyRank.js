const db = require("../db/database");

module.exports = {
  name: "!월간랭킹",
  execute: async (message) => {
    try {
      const query = `
        SELECT username, SUM(duration) AS total_seconds
        FROM voice_logs
        WHERE timestamp >= NOW() - INTERVAL '30 days'
        GROUP BY username
        ORDER BY total_seconds DESC
        LIMIT 10
      `;
      const result = await db.query(query);

      if (result.rows.length === 0) {
        return message.channel.send("🥲 지난 30일간 기록이 없어요!");
      }

      const rankingText = result.rows
        .map(
          (row, index) =>
            `${index + 1}위. ${row.username} — ${Math.floor(
              row.total_seconds / 60
            )}분`
        )
        .join("\n");

      message.channel.send(`🗓️ **월간 공부 랭킹 (최근 30일)**\n\n${rankingText}`);
    } catch (err) {
      console.error("❌ 월간랭킹 오류:", err.message);
      message.channel.send("월간 랭킹 정보를 불러오는 중 오류가 발생했어요.");
    }
  },
};

