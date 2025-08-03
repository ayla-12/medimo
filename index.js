require("dotenv").config();
require("./keepAlive");

const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits } = require("discord.js");

// ✅ 환경변수 체크
if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN이 .env에 없습니다!");
  process.exit(1);
}

// ✅ 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

// ✅ 음성 트래킹 이벤트 로딩
try {
  const voiceTracker = require("./events/voiceTrackers");
  voiceTracker(client);
} catch (err) {
  console.error("❌ voiceTracker 로드 중 오류:", err.message);
}

// ✅ 명령어 로딩
const commands = new Map();
try {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, "commands"))
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name && command.execute) {
      commands.set(command.name, command);
    }
  }
} catch (err) {
  console.error("❌ 명령어 로딩 중 오류:", err.message);
}

// ✅ 메시지 핸들링
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith("!")) return;

  const args = message.content.trim().split(/ +/);
  const commandName = args[0]; // '!잔소리'
  const command = commands.get(commandName);

  if (command) {
    try {
      await command.execute(message);
    } catch (err) {
      console.error(`❌ 명령어 실행 오류 (${commandName}):`, err.message);
    }
  }
});

// ✅ 로그인 및 준비 로그
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ✅ 로그인 시도
(async () => {
  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error("❌ Discord 로그인 실패:", err.message);
  }
})();

process.stdin.resume(); // 프로세스를 유지시킴
