const { Events, EmbedBuilder } = require('discord.js');
const { clientId, ownerId } = require('../config.json');
const fs = require('fs');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return false;

        const guildId = message.guild.id;
        const serverData = 'data/serverdata.json';
        let iData = JSON.parse(fs.readFileSync(serverData));
        const defaultSettings = {
            'owner': `${message.guild.ownerId}`,
            'color': '',
            'levels': 'false',
            'welcomechannel': '',
            'exitchannel': '',
            'autorole': '',
            'suggestionschannel': '',
            'starboardchannel': '',
            'requiredstars': '',
        };

        if (!iData[guildId]) {
            iData[guildId] = defaultSettings;
            fs.writeFileSync(
                serverData,
                JSON.stringify(iData, null, 4),
            );
            console.log(`Guild ${message.guild.name} added to database, ID${guildId}`);
        }

        const iUser = message.author;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const repEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date())
            .setTitle('Prizmo365')
            .setDescription('Hello! I\'m Prizmo, your friendly neighborhood assisant!')
            .setColor('#17ac86');
        if (message.mentions.has(clientId)) {
            message.reply({ embeds: [repEmbed] });
        }

        if (message.author.id == ownerId && message.content == 'dr') {
            iData = {
                'default': {
                    'owner': '',
                    'color': '',
                    'levels': 'false',
                    'welcomechannel': '',
                    'exitchannel': '',
                    'autorole': '',
                    'suggestionschannel': '',
                    'starboardchannel': '',
                    'requiredstars': '',
                },
            };
            fs.writeFileSync(
                serverData,
                JSON.stringify(iData, null, 4),
            );
            console.log('Database reset forcefully.');
        }

        if (message.author.id == ownerId && message.content == 'r') {
            console.log('Forced restart.');
            await message.reply('Restarting...');
            process.exit();
        }
    },
};