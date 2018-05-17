//Libraries
const Discord = require("discord.js");

//The bot itself
const client = new Discord.Client();
client.login(process.env.BOT_TOKEN); //<- IMPORTANT, NEVER REVEAL THE BOT TOKEN

//Config
const config = require("./config.json");


// This event will run if the bot starts, and logs in, successfully.
client.on("ready", () => {
console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  //This changes the bot status, Playing : ""
  client.user.setActivity(config.onlinemessage);
  //set username from the config.json
  client.user.setUsername(config.username);
});

//This event will run on every single message received, from any channel or DM.
client.on("message", async message => {
  //To prevent botception
  if(message.author.bot) return;
  //If no prefix, then stop
  if(message.content.indexOf(config.prefix) !== 0) return;
  //Separate command name and arguments
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	//COMMANDS

  //ping command  
  if(command === "ping"){
  const m = await message.channel.send("Ping?");
  m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
});