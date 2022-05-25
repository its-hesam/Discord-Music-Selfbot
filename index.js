const {
       Client,
       Collection
      } = require('discord.js-selfbot-v13');
const client = new Client();
const {
     SpringManager 
      } = require("springlink");
const {
     token ,
     prefix ,
     nodes ,
    } = require('./config.json')
const fs = require('fs')


let played = false;
let qsize = 1;
client.manager = new SpringManager(client, nodes, {
    sendWS: (data) => {
        const guild = client.guilds.cache.get(data.d.guild_id);
        if (guild) guild.shard.send(data);
    },
});

client.manager.on("nodeConnect", (node) => {
    console.log(`${node.host} has been connected.`);
});

client.manager.on("trackStart", (player, track) => {
    if (!played && Array.isArray(track)) {
        played = true;
        return player.textChannel.send(`Now playing \`${track[0].title}\``).then(msg =>
            { 
            setTimeout(() => { msg.delete() }, 1000)
            });
    }
    return player.textChannel.send(`Now playing \`${Array.isArray(track) ? track[qsize++].title : track.title}\``).then(msg =>
        { 
        setTimeout(() => { msg.delete() }, 1000)
        });
});
client.manager.on("queueEnd", (player) => {
    player.destroy()
    player.textChannel.send(`Queue End!`).then(msg =>
        { 
        setTimeout(() => { msg.delete() }, 1000)
        });
});


client.on("raw", (packet) => {
    client.manager.packetUpdate(packet);
});


client.commands = new Collection();

const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./Commands/${file}`);
	client.commands.set(command.name, command);
}

fs.readdirSync("./events/Client/").forEach(file => {
    const event = require(`./events/Client/${file}`);
    client.on(event.name, (...args) => event.execute(client, ...args));
});


client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);

	const command = args.shift().toLowerCase();
    
	if (!client.commands.has(command)) return;
	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
	}
});

process.on("unhandledRejection", (reason, promise) => {
  try {
    console.error(
      "Unhandled Rejection at: ",
      promise,
      "reason: ",
      reason.stack || reason
    );
  } catch {
    console.error(reason);
  }
});



client.login(token);