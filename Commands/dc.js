module.exports = {
	name: 'dc',
	description: 'Disconnect!',
	async execute(message) 
    {
        const player = message.client.manager.get(message.guild.id);
        player.destroy();
	},
};