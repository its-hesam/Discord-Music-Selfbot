module.exports = {
	name: 'loop',
	description: 'Loop Queue!',
	async execute(message) 
    {
        const player = message.client.manager.get(message.guild.id);
       message.reply({content : `Loop Enabled!`}).then(msg =>
        { 
        setTimeout(() => { msg.delete() }, 1000)
        });
        return player.setQueueRepeat()
	},
};