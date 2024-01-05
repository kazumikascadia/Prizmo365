const { Client, Events, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        // sets up requirements for all of the information
        const guildId = reaction.message.guild.id;
        const serverData = 'data/serverdata.json';
        const iData = JSON.parse(fs.readFileSync(serverData));

        // checks for any reaction partials (or, reactions on messages)
        if (reaction.partial) {
            try {
                // if it finds one, fetch it
                await reaction.fetch();
            }
            catch (error) {
                // if it fails to fetch it, log it and the error
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        // do nothing if the author of the starred message is a bot
        if (reaction.message.author.bot) return false;
        // do nothing if the server doesn't have a starboard channel, if the channel can't be found/isn't a text channel, or if the server requires less than one star
        if (!iData[guildId] || iData[guildId].starboardchannel == '') return false;
        if (!reaction.message.guild.channels.cache.get(iData[guildId].starboardchannel)) return false;
        if (iData[guildId].requiredstars < 1) return false;
        // do nothing if the reaction is not a star
        if (reaction.emoji.name !== '⭐') return false;

        // set up ALL required variables for the embed and the message sending; all of these are exactly what they look like
        const starReq = iData[guildId].requiredstars;
        const starCount = reaction.count;
        const starSender = reaction.message.author;
        const starContent = reaction.message.content;
        const starChannel = reaction.message.guild.channels.cache.get(iData[guildId].starboardchannel);
        const starId = reaction.message.id;
        const nickname = starSender.nickname ?? starSender.displayName;
        const avatar = starSender.displayAvatarURL();

        // if the star count is less than the requirement, do not send the message
        if (starCount < starReq) return false;

        // set up the embed
        const starboardEmbed = new EmbedBuilder()
            .setTitle(`${starReq} Stars!`)
            .setTimestamp(+new Date())
            .setColor('Gold')
            .setAuthor({ name: nickname, iconURL: avatar })
            .setFooter({ text: `ID: ${starId}` });

        // these next two checks ensure that an empty embed is not sent, thus preventing any breaks
        // check if the message has any attachments; if it does, grab the first one and add it to the embed
        if (reaction.message.attachments.size > 0) {
            const attachment = reaction.message.attachments.first().url;

            starboardEmbed.setImage(attachment);
        }
        // check if the message actually has content; if it does, add a description to the embed
        if (starContent.length > 1) {
            starboardEmbed.setDescription(starContent);
        }

        // finally, send the message
        starChannel.send({ content: `[Original Message](${reaction.message.url}) (from ${reaction.message.channel})`, embeds: [starboardEmbed] });
    },
};