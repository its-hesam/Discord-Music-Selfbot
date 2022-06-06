//Express Server
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Bot Is Working Well!'));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

//Bot
const {
       Client,
       Collection
      } = require('discord.js-selfbot-v13');
const client = new Client();
const fs = require('fs')
const {
     SpringManager 
      } = require("springlink");
const { token,
        ownerid,
        nodes,
     } = require('./config.json')
    if (!token || !ownerid) {
        console.log('Please Fill Out Config file')
        process.exit()
      }

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
    return player.textChannel.send(`Now playing \`${track.title}\``).then(msg =>
        { 
        setTimeout(() => { msg.delete() }, 1000)
        });
});

client.manager.on("trackEnd", (player) => {
    player.destroy()
    player.textChannel.send(`Track End!`).then(msg =>
        { 
        setTimeout(() => { msg.delete() }, 1000)
        });
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
