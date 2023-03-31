import { EmbedBuilder } from "discord.js";


export const logChannelID = "";  // Put your channel ID here

export const logDiscordEvent = (title: string) => {  // Creates a basic embed for logging discord events
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(0x9328FF) // Purple
    .setTimestamp(new Date());

  return embed;
}
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARNING",
  ERROR = "ERROR",
  FATAL = "FATAL"
}

export const logMessage = (message: string, level: LogLevel = LogLevel.DEBUG) => {
  // You can specify the log level, but if you don't it will default to DEBUG
  // You have to also import levels and LogLevel
  if (!LogLevel.hasOwnProperty(level)) {
    throw new Error(`Invalid log level: ${level} \n Valid levels: ${Object.values(LogLevel)}`);
  }

  const splitter = '::';
  const timeStamp = new Date().toUTCString();
  const logMessage = `[${level}]:  ${timeStamp} ${splitter} ${message}`;
  console.log(logMessage);
  // Example:
  // [INFO]:  Fri, 31 Mar 2023 02:19:57 GMT :: test 
}