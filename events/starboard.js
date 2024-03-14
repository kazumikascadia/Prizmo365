const { Client, Events, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        // sets up requirements for all of the information
        const guildId = reaction.message.guild.id;
        const guilddata = 'data/guilddata.json';
        const gdImport = JSON.parse(fs.readFileSync(guilddata));
        const starboarddata = 'data/starboarddata.json';
        const sbdImport = JSON.parse(fs.readFileSync(starboarddata));

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
        if (!gdImport[guildId] || gdImport[guildId].starboardchannel == '') return false;
        if (!reaction.message.guild.channels.cache.get(gdImport[guildId].starboardchannel)) return false;
        if (gdImport[guildId].requiredstars < 1) return false;
        // do nothing if the reaction is not a star
        if (reaction.emoji.name !== '⭐') return false;

        // set up ALL required variables for the embed and the message sending; all of these are exactly what they look like
        const starReq = gdImport[guildId].requiredstars;
        const starCount = reaction.count;
        const starSender = reaction.message.author;
        const starContent = reaction.message.content;
        const starChannel = reaction.message.guild.channels.cache.get(gdImport[guildId].starboardchannel);
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

        // check if the message actually has content; if it does, add a description to the embed
        if (starContent.length > 1) {
            starboardEmbed.setDescription(starContent);
        }
        else {
            starboardEmbed.setDescription('*No text attached.*');
        }

        if (!sbdImport[starId]);
        else return false;

        const writeIn = {
            'content': starContent,
            'guild': guildId,
            'stars': starCount,
        };

        // if (!sbdImport[guildId]) {
        //     sbdImport[guildId] = format;
        //     fs.writeFileSync(
        //         starboarddata,
        //         JSON.stringify(sbdImport, null, 2),
        //     );
        // }

        sbdImport[starId] = writeIn;
        fs.writeFileSync(
            starboarddata,
            JSON.stringify(sbdImport, null, 2),
        );

        // check if the message has any attachments; if it does, grab the first one and add it to the embed
        if (reaction.message.attachments.size > 0) {
            const attachment = reaction.message.attachments.first().url;

            console.log(reaction.message.attachments.first().contentType);

            // check the content type of the attachment
            // if the attachment is a video, send it as an extra file
            if (reaction.message.attachments.first().contentType.includes('video/')) {
                starChannel.send({ content: `[Original Message](${reaction.message.url}) (from ${reaction.message.channel})`, embeds: [starboardEmbed], files: [attachment] });
            }
            // if the content type is NOT a video, add it to the embed
            else {
                starboardEmbed.setImage(attachment);
                starChannel.send({ content: `[Original Message](${reaction.message.url}) (from ${reaction.message.channel})`, embeds: [starboardEmbed] });

            }

        }

        else {
            starChannel.send({ content: `[Original Message](${reaction.message.url}) (from ${reaction.message.channel})`, embeds: [starboardEmbed] });
        }


    },
};