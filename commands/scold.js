module.exports = {
    name: "!잔소리",
    execute: async (message) => {
      const args = message.content.trim().split(/ +/); // ['!잔소리', '닉네임']
      const targetName = args.slice(1).join(" "); // 멀티단어 닉네임 대응
  
      if (!targetName) {
        return message.reply("누구한테 잔소리할지 닉네임을 적어줘야 해! 예: `!잔소리 메둥이`");
      }
  
      const scoldMessages = [
        "지금 뭐함? 공부하기로 했잖아? 👁️👁️",
        "집중력, 나가셨어요~ 다시 호출해와",
        "오케이~ 딴짓 그만~ 폰 손에서 놓아~ ",
        "멍 때리다가 시간 순삭된다",
        "지금 안 하면 나중에 울어~ 진짜루",
      ];
  
      const random = scoldMessages[Math.floor(Math.random() * scoldMessages.length)];
  
      message.channel.send(`**${targetName}**! ${random}`);
    },
  };
  