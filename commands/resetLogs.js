const db = require("../db/database");

module.exports = {
  name: "!기록초기화",
  execute: async (message) => {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("🚫 이 명령어는 관리자만 사용할 수 있어요!");
    }

    try {
      await db.query("DELETE FROM voice_logs");
      message.channel.send("🧹 기록이 모두 초기화되었습니다!");
    } catch (err) {
      console.error("❌ 초기화 실패:", err.message);
      message.channel.send("⚠️ 로그 초기화에 실패했어요.");
    }
  },
};
