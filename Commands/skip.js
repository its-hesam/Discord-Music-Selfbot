module.exports = {
	name: 'skip',
	description: 'Skip Music!',
	async execute(message) 
    {
        const player = message.client.manager.get(message.guild.id);
        player.stop();
		message.reply({content : `Music Skiped!`}).then(msg =>
        { 
        setTimeout(() => { msg.delete() }, 1000)
        });
	},
};