'use_strict'
//Libraries
const Discord = require("discord.js");
const ms = require("ms");
const ontime = require('ontime');

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
  };

  //say command
  if(command === "say"){
    //requiredRoles
    if(!message.member.roles.some(r=>(config.requiredRoles).includes(r.name)) )
      return ;
    //Arguments
    const sayMessage = args.join(" ");
    //Delete command
    message.delete().catch(O_o=>{});
    //The bot sends the message
    message.channel.send(sayMessage);
  }

  //gulag command
  if(command === "gulag"){
    if(!message.member.roles.some(r=>(config.requiredRoles).includes(r.name)) )
      return ;
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please specify a valid user");
    if(member.roles.some(r=>(config.requiredRoles).includes(r.name)) )
      return message.reply("Sorry, i cant **gulag** this user");
    let gulag = message.guild.roles.find("name", "Stateless");
    let input = message.content.split(" ").slice(1);
    let time = input[1];
    if(!input)
      return time = `1h`;
    //let time = `${conv}m`;
    //let time = `1m`;
    //let time = `15m`; //params
    member.addRole(gulag).catch(console.error);
    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      description: `<@${member.user.id}> you've been muted for ${ms(ms(time), {long: true})}`
    }}).then(message => {
      message.delete(120000)
    });
    setTimeout(() => {
      member.removeRole(gulag);
      message.channel.send({embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        description: `<@${member.user.id}> You were unmuted! The mute lasted: ${ms(ms(time), {long: true})}`
      }}).then(message => {
        message.delete(120000)
      });
     }, ms(time));
  }
});//End of the on.message event
/*
* TODO:
    *Database
    *add default timeout for gulag
    *ungulag command
    *improve the reddit post's system
    *suggestion command for the #suggestions channel
    *meme commands?
*/