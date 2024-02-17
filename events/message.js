const { Events, EmbedBuilder } = require('discord.js');
const { clientId, ownerId } = require('../config.json');
const fs = require('fs');


function generateData(defaultSettings, guilddata, gdImport, leveldata, ldImport, guildId, userId) {


    if (!gdImport[guildId]) {
        gdImport[guildId] = defaultSettings;
        fs.writeFileSync(
            guilddata,
            JSON.stringify(gdImport, null, 4),
        );
        // console.log(`Guild ${message.guild.name} added to database, ID${guildId}`);
    }

    if (!ldImport[guildId]) {
        ldImport[guildId] = {};
        fs.writeFileSync(
            leveldata,
            JSON.stringify(ldImport, null, 4),
        );
    }

    if (!ldImport[guildId][userId]) {
        ldImport[guildId][userId] = '0',
            fs.writeFileSync(
                leveldata,
                JSON.stringify(ldImport, null, 4),
            );
    }
}

function progressLvl(leveldata, ldImport, guildId, userId, message) {
    const u = message.author;
    const gImport = ldImport[guildId];
    const uXp = gImport[userId];
    const rewards = gImport.rewards;

    // determines the amount of xp to be earned per level
    let xp;
    if (message.content.length <= 25) {
        xp = Math.floor(Math.random() * message.content.length + 1);
    }
    else {
        xp = Math.floor(Math.random() * 25 + 1);
    }
    const l = Math.floor(uXp / 150);

    gImport[userId] = (Number(uXp) + xp).toString();
    fs.writeFileSync(
        leveldata,
        JSON.stringify(ldImport, null, 4),
    );

    // update level
    if (!rewards[l]) {
        null;
    }
    else {
        const rRole = message.guild.roles.cache.find(role => role.id === rewards[l]);
        message.member.roles.add(rRole);
    }

    // if (uImport.xp >= reqXp) {
    //     uImport.level = (nextLvl).toString();
    //     fs.writeFileSync(
    //         leveldata,
    //         JSON.stringify(ldImport, null, 4),
    //     );
    // }

    // if ()
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // if (message.author.bot) return false;
        const guildId = message.guild.id;
        const guilddata = 'data/guilddata.json',
            gdImport = JSON.parse(fs.readFileSync(guilddata));
        const leveldata = 'data/leveldata.json',
            ldImport = JSON.parse(fs.readFileSync(leveldata));
        const userId = message.author.id;
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

        generateData(defaultSettings, guilddata, gdImport, leveldata, ldImport, guildId, userId);

        if (gdImport[guildId].levels == 'true') {
            progressLvl(leveldata, ldImport, guildId, userId, message);
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
        // if (message.mentions.has(clientId)) {
        //     message.reply({ embeds: [repEmbed], ephemeral: true });
        // }

        // if (message.author.id == ownerId && message.content == 'dr') {
        //     gdImport = {
        //         'default': {
        //             'owner': '',
        //             'color': '',
        //             'levels': 'false',
        //             'welcomechannel': '',
        //             'exitchannel': '',
        //             'autorole': '',
        //             'suggestionschannel': '',
        //             'starboardchannel': '',
        //             'requiredstars': '',
        //         },
        //     };
        //     fs.writeFileSync(
        //         guilddata,
        //         JSON.stringify(gdImport, null, 4),
        //     );
        //     console.log('Database reset forcefully.');
        // }

        // if (message.author.id == ownerId && message.content == 'r') {
        //     console.log('Forced restart.');
        //     await message.reply('Restarting...');
        //     process.exit();
        // }
    },
};