const { Events } = require("discord.js");
const { saveVoiceLog } = require("../db/database");

module.exports = (client) => {
  // 타겟 채널 ID들 (.env에 ,로 구분해 저장됨)
  const TARGET_CHANNEL_IDS = process.env.TARGET_CHANNEL_IDS.split(",");

  // 유저의 입장 시간을 저장할 Map
  const joinTimestamps = new Map();

  client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    const userId = newState.id;
    const member = newState.member;

    const enteredFrom = oldState.channelId;
    const enteredTo = newState.channelId;

    const joinedTarget = !enteredFrom && TARGET_CHANNEL_IDS.includes(enteredTo);
    const leftTarget = TARGET_CHANNEL_IDS.includes(enteredFrom) && !enteredTo;

    // ✅ 입장했을 때 시간 저장
    if (joinedTarget) {
      console.log(`입장 감지됨: ${member.user.tag}`);
      joinTimestamps.set(userId, Date.now());
    }

    // ✅ 퇴장했을 때 시간 계산
    if (leftTarget && joinTimestamps.has(userId)) {
      // 🐛 디버깅 로그
      console.log(`퇴장 감지됨: ${member.user.tag}`);

      const joinedAt = joinTimestamps.get(userId);
      const duration = Math.floor((Date.now() - joinedAt) / 1000);

      // 🐛 디버깅 로그
      console.log(`총 체류 시간: ${duration}초`);

      joinTimestamps.delete(userId); // 추적 종료

      // 역할 정보: "Team"으로 시작하는 역할이 있다면 그걸 저장
      const roleName =
        member.roles.cache
          .map((r) => r.name)
          .find((name) => name.startsWith("Team")) || "Unassigned";

      // DB에 저장
      saveVoiceLog(userId, member.user.tag, roleName, duration);
    }
  });
};
