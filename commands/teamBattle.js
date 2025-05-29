const { query } = require('../db/database');

async function getTeamRanking() {
  try {
    const result = await query(
      `
      SELECT role_name, SUM(duration) AS total_seconds
      FROM voice_logs
      WHERE timestamp >= NOW() - INTERVAL '7 days'
        AND role_name IS NOT NULL
        AND role_name != ''
      GROUP BY role_name
      ORDER BY total_seconds DESC
      `
    );

    const rows = result.rows;

    if (rows.length === 0) {
      return '😢 지난 일주일간 팀 기록이 없어요!';
    }

    const formatted = rows
      .map((row, index) => `${index + 1}위. ${row.role_name} — ${Math.floor(row.total_seconds / 60)}분`)
      .join('\n');

    return `🏆 **팀별 대전 (최근 7일 기준)**\n\n${formatted}`;
  } catch (err) {
    console.error('❌ 팀 랭킹 조회 실패:', err.message);
    return '⚠️ 팀 랭킹을 불러오는 중 오류가 발생했어요.';
  }
}

module.exports = {
  name: '!팀별대전',
  execute: async (message) => {
    const ranking = await getTeamRanking();
    message.channel.send(ranking);
  },
};
