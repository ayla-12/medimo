module.exports = {
    name: "!잔소리",
    execute: async (message) => {
      // 유저 멘션 객체 가져오기
      const mention = message.mentions.members?.first(); // members로!
  
      console.log("멘션된 유저:", mention);

      if (!mention) {
        return message.reply("누구한테 잔소리할지 멘션해줘야 해! 예: `!잔소리 @메둥이`");
      }
  
      const scoldMessages = [
        "지금 뭐함? 너 공부하기로 했잖아? 🤨",
        "집중력, 나가셨어요~ 다시 호출해와 🧠",
        "오케이~ 딴짓 그만~ 손에서 놓아~ 🙅‍♀️",
        "멍 때리다가 시간 순삭 주의보 ⏳",
        "지금 안 하면 나중에 울어~ 진짜루 😢",
      ];
  
      const random = scoldMessages[Math.floor(Math.random() * scoldMessages.length)];
  
      message.channel.send(`${mention} ${random}`);
    },
  };

  