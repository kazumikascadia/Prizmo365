const { Client, Events, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        const guildId = reaction.message.guild.id;
        const serverData = 'data/serverdata.json';
        const iData = JSON.parse(fs.readFileSync(serverData));

        if (reaction.partial) {
            try {
                await reaction.fetch();
            }
            catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        if (reaction.message.author.bot) return false;
        if (!iData[guildId] || iData[guildId].starboardchannel == '') return false;
        if (!reaction.message.guild.channels.cache.get(iData[guildId].starboardchannel)) return false;
        if (reaction.emoji.name !== '⭐') return false;
        if (iData[guildId].requiredstars < 1) return false;

        const starReq = iData[guildId].requiredstars;
        const starCount = reaction.count;
        const starSender = reaction.message.author;
        const starContent = reaction.message.content;
        const starChannel = reaction.message.guild.channels.cache.get(iData[guildId].starboardchannel);
        const starId = reaction.message.id;
        const nickname = starSender.nickname ?? starSender.displayName;
        const avatar = starSender.displayAvatarURL();

        if (starCount < starReq) return false;

        const starboardEmbed = new EmbedBuilder()
            .setTitle(`${starReq} Stars!`)
            .setTimestamp(+new Date())
            .setColor('Gold')
            .setAuthor({ name: nickname, iconURL: avatar })
            .setFooter({ text: `ID: ${starId}` });

        if (reaction.message.attachments.size > 0) {
            const attachment = reaction.message.attachments.first().url;

            starboardEmbed.setImage(attachment);
        }
        if (starContent.length > 1) {
            starboardEmbed.setDescription(starContent);
        }

        // console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
        // console.log(`${reaction.count} user(s) have given the same reaction to this message!`);

        starChannel.send({ content: `${reaction.message.channel}, [Original Message](${reaction.message.url})`, embeds: [starboardEmbed] });
    },
};