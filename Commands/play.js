module.exports = {
	name: 'play',
	description: 'Play Music!',
    inVoiceChannel: true,
    sameVoiceChannel: true,
    owner: true,
    async execute(message,args) 
    {
        const player = await message.client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel,
            selfDeaf: true,
            selfMute: false,
        });

        const SearchMusic =  args.join(" ");
        const resolve = await message.client.manager.resolveTrack(SearchMusic);

        switch (resolve.loadType) {
            case "NO_RESULTS":
                message.channel.send({ content: "There are no results found.!" }).then(msg =>
                    { 
                    setTimeout(() => { 
                        msg.delete() 
                    }, 1000)
                    });
            break;

            case "TRACK_LOADED":
                player.queue.add(resolve.tracks[0]);
                message.channel.send({ content: `Added: \`${resolve.tracks[0].title}\`` }).then(msg =>
                    { 
                    setTimeout(() => { 
                        msg.delete() 
                    }, 1000)
                    });
                if (!player.playing && !player.paused) return player.play();
            break;

            case "PLAYLIST_LOADED":
                player.queue.add(resolve.tracks);
                message.channel.send({ content: `Added: \`${resolve.tracks.length / 2}\`` }).then(msg =>
                    { 
                    setTimeout(() => { 
                        msg.delete() 
                    }, 1000)
                    });
                if (!player.playing && !player.paused) return player.play();
            break;

            case "SEARCH_RESULT":
                player.queue.add(resolve.tracks[0]);
                message.channel.send({ content: `Added: ${resolve.tracks[0].title}` }).then(msg =>
                    { 
                    setTimeout(() => { 
                        msg.delete() 
                    }, 1000)
                    });
                if (!player.playing) return player.play();
            break;
        }
        return null;
	},
};