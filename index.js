require("dotenv").config();

const fs = require("fs");
const path = require("path");

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

// 메시지 입력 처리
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!")) return;

  const command = commands.get(message.content.trim());
  if (command) {
    await command.execute(message);
  }
});

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

const voiceTracker = require("./events/voiceTracker");
voiceTracker(client);

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
