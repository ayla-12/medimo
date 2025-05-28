require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits } = require("discord.js");

// 1️⃣ 먼저 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

// 2️⃣ 이벤트 로더
const voiceTracker = require("./events/voiceTracker");
voiceTracker(client);

// 3️⃣ 명령어 로더
const commands = new Map();
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name && command.execute) {
    commands.set(command.name, command);
  }
}

// 4️⃣ 명령어 실행 핸들러
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!")) return;

  const command = commands.get(message.content.trim());
  if (command) {
    await command.execute(message);
  }
});

// 5️⃣ 로그인 및 ready 로그
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
