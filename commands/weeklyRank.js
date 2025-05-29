const { query } = require('../db/database');

async function getWeeklyRanking() {
  try {
    const result = await query(
      `
      SELECT username, SUM(duration) AS total_seconds
      FROM voice_logs
      WHERE timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY user_id, username
      ORDER BY total_seconds DESC
      LIMIT 10
      `
    );

    const rows = result.rows;

    if (rows.length === 0) {
      return '🥲 지난 일주일간 기록이 없어요!';
    }

    const formatted = rows
      .map((row, index) => `${index + 1}위. ${row.username} — ${Math.floor(row.total_seconds / 60)}분`)
      .join('\n');

    return `📅 **주간 공부 랭킹 (최근 7일)**\n\n${formatted}`;
  } catch (err) {
    console.error('❌ 주간 랭킹 조회 실패:', err.message);
    return '⚠️ 주간 랭킹을 불러오는 중 오류가 발생했어요.';
  }
}

module.exports = {
  name: '!주간랭킹',
  execute: async (message) => {
    const ranking = await getWeeklyRanking();
    message.channel.send(ranking);
  },
};
