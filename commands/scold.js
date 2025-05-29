module.exports = {
    name: '!잔소리',
    execute: async (message) => {
      const mention = message.mentions.users.first();
  
      if (!mention) {
        return message.reply('누구한테 잔소리할지 멘션해줘야 해! 예: `!잔소리 @둥이`');
      }
  
      const scoldMessages = [
        '지금 뭐해?! 얼른 집중해!! 🔥',
        '오늘도 할 일 해야지? 👀',
        '딴짓 그만하고 집중하자 💪',
        '나중에 후회하지 말고 지금 해! 🧠',
        '할 수 있어! 하자! 지금! 🕒',
        '지금 하는 게 나중의 너를 만든다 💡',
      ];
  
      const random = scoldMessages[Math.floor(Math.random() * scoldMessages.length)];
  
      message.channel.send(`${mention} ${random}`);
    },
  };
 