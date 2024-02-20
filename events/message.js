const { Events, EmbedBuilder } = require('discord.js');
const { clientId, ownerId } = require('../config.json');
const fs = require('fs');
const level = require('../commands/utility/level');
const { e } = require('mathjs');

function generateData(defaultSettings, guilddata, gdImport, leveldata, ldImport, guildId, userId) {

    if (!gdImport[guildId]) {
        gdImport[guildId] = defaultSettings;
        fs.writeFileSync(
            guilddata,
            JSON.stringify(gdImport, null, 4),
        );
    }

    if (!ldImport[guildId]) {
        ldImport[guildId] = {};
        fs.writeFileSync(
            leveldata,
            JSON.stringify(ldImport, null, 4),
        );
    }

    if (!ldImport[guildId][userId]) {
        ldImport[guildId][userId] = '0;0',
            fs.writeFileSync(
                leveldata,
                JSON.stringify(ldImport, null, 4),
            );
    }
}

function progressLvl(gdImport, leveldata, ldImport, guildId, userId, message) {
    if (message.author.bot) return false;
    const u = message.author;
    const gImport = ldImport[guildId];
    const uData = gImport[userId].split(';');
    let lvl = Number(uData[0]), uXp = Number(uData[1]);
    const reqXp = ((lvl + 1) * 150);
    const rewards = gImport.rewards;
    const lvlchannelId = gdImport.levelchannel;
    const lvlchannel = message.guild.channels.cache.get(lvlchannelId);
    const iUser = message.author;
    const nickname = iUser.nickname ?? iUser.displayName;
    const avatar = iUser.displayAvatarURL();

    // determines the amount of xp to be earned per level
    let xp;
    if (message.content.length <= 25) {
        xp = Math.floor(Math.random() * message.content.length + 1);
    }
    else {
        xp = Math.floor(Math.random() * 25 + 1);
    }

    uXp += xp;
    gImport[userId] = `${lvl};${(Number(uXp) + xp)}`;
    fs.writeFileSync(
        leveldata,
        JSON.stringify(ldImport, null, 4),
    );

    if (uXp >= reqXp) {
        const r = uXp - reqXp;
        uXp = r;
        gImport[userId] = `${lvl + 1};${uXp}`;
        fs.writeFileSync(
            leveldata,
            JSON.stringify(ldImport, null, 4),
        );
        lvl += 1;
        if (!rewards[lvl]) {
            null;
        }
        else {
            const rRole = message.guild.roles.cache.find(role => role.id === rewards[lvl]);
            message.member.roles.add(rRole);
        }
        if (!lvlchannelId) { return; }
        else if (lvlchannel.type == '0') {
            const lvlUpEmbed = new EmbedBuilder()
                .setTimestamp(+new Date())
                .setTitle('Level Up!')
                .setAuthor({ name: nickname, iconURL: avatar })
                .setDescription(
                    `Congrats, ${iUser}!
                You have levelled up to ${lvl}`,
                )
                .setColor('Green');

            lvlchannel.send({ embeds: [lvlUpEmbed] });
        }
        else { return; }
    }
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
            'levelchannel': '',
            'welcomechannel': '',
            'exitchannel': '',
            'autorole': '',
            'suggestionschannel': '',
            'starboardchannel': '',
            'requiredstars': '',
        };
        const iUser = message.author;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();

        generateData(defaultSettings, guilddata, gdImport, leveldata, ldImport, guildId, userId, iUser, nickname, avatar);

        if (gdImport[guildId].levels == 'true') {
            progressLvl(gdImport, leveldata, ldImport, guildId, userId, message);
        }

        const repEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date())
            .setTitle('Prizmo365')
            .setDescription(
                `Hello! I'm Prizmo, your friendly neighborhood assisant!
                If you'd like to use one of my commands, type in the \`/\` key without anything before it and start looking!
                (A \`/help\` command is coming in the future, I promise!)`,
            )
            .setColor('#17ac86');
        if (message.mentions.has(clientId) && !message.mentions.everyone) {
            message.reply({ embeds: [repEmbed], ephemeral: true });
        }

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