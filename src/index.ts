import { config } from "dotenv";
import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { start, tryReward } from './util/chat-reward';

import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
} from "discord.js";
config();
const PREFIX = "+";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
const cmdPath = join(__dirname, "commands");
const commandFiles = readdirSync(cmdPath);
const textCommandFiles = readdirSync(join(cmdPath, "text"));
const commands = new Collection<string, any>();
const textCommands = new Collection<string, any>();
commandFiles.forEach(async (file) => {
  if ((await lstatSync(join(cmdPath, file))).isDirectory()) return; // skip sub-folders

  const command = (await import(join(cmdPath, file))).default;
  if (command.data && command.execute) {
    console.log("Loaded command: " + command.data.name);
    commands.set(command.data.name, command);
  }
});

textCommandFiles.forEach(async (file) => {
  const command = (await import(join(cmdPath, "text", file))).default;

  if (command.execute && command.name) {
    textCommands.set(command.name, command);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: "There was an error: " + error,
      });
    }
  }
});

client.on(Events.MessageCreate, async (event) => {
  if (event.content.startsWith(PREFIX)) {
    const spaceIndex = event.content.indexOf(" ");
    const newLineIndex = event.content.indexOf("\n");
    if (spaceIndex == -1 && newLineIndex == -1) {
      await event.reply("Command not found, or no arguments were provided.");
      return;
    }
    const index =
      spaceIndex == -1
        ? newLineIndex
        : newLineIndex == -1
        ? spaceIndex
        : newLineIndex;
    const textCommandName = event.content.substring(PREFIX.length, index);
    const command = textCommands.get(textCommandName);
    try {
      await command.execute(event);
    } catch (error) {
      await event.reply({
        content: "There was an error: " + error,
      });
    }
  } else {
    tryReward(event.author.id);
  };
});

client.login(process.env.TOKEN);
start();
