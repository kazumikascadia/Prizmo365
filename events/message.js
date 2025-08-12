const { Events, EmbedBuilder } = require('discord.js');
const { clientId, ownerId } = require('../config.json');
const fs = require('fs');
const level = require('../commands/guild/level');

function writeData(data, iData) {
    fs.writeFileSync(
        data,
        JSON.stringify(iData, null, 4),
    );
}

function generateData(defaultSettings, guilddata, gdImport, leveldata, ldImport, guildId, userId) {

    if (!gdImport[guildId]) {
        gdImport[guildId] = defaultSettings, writeData(guilddata, gdImport);
    }

    if (!ldImport[guildId]) {
        ldImport[guildId] = {
            'rewards': {},
        };
        writeData(leveldata, ldImport);
    }

    if (!ldImport[guildId][userId]) {
        ldImport[guildId][userId] = '0;0', writeData(leveldata, ldImport);
    }
}

// function for level progression; uses guilddata, leveldata, guildId, userId, and message information
function progressLvl(gdImport, leveldata, ldImport, guildId, userId, message) {
    // checks if the author of the message is a discord bot
    if (message.author.bot) return false;
    const u = message.author;
    const gImport = ldImport[guildId];
    const uData = gImport[userId].split(';');
    let lvl = Number(uData[0]), uXp = Number(uData[1]);
    const reqXp = ((lvl + 1) * 500);
    const rewards = gImport.rewards;
    const lvlchannelId = gdImport[guildId].levelchannel;
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

    // adds more xp depending on the amount of words in the sentence
    // cuts off at a length of 10, to prevent a huge amount of xp flow
    const m = message.content.split(' ');
    if (m.length <= 10) {
        // if the length is less than 10
        // multiplies the amount of words in the sentence by 2, then adds them to the original xp amount
        xp = xp + (2 * m.length);
    }
    else {
        // if the length is greater than 10
        // multiplies the amount of words in the sentence by 20, then adds them to the original xp amount
        xp = xp + 20;
    }

    // sets user xp to be equal to the calculated xp
    uXp += xp;

    // updates the leveldata file
    // set up as {lvl number} split by semi-colon followed by userXp
    gImport[userId] = `${lvl};${uXp}`;
    writeData(leveldata, ldImport);

    // checks if user xp is greater than the required xp of 1 level higher
    if (uXp >= reqXp) {

        // calculates any residual left over from the xp;
        // r = residual xp
        const r = uXp - reqXp;

        // to prevent xp from being set back to 0, uXp is set as the residual
        uXp = r;

        // sets
        gImport[userId] = `${lvl + 1};${uXp}`;
        writeData(leveldata, ldImport);

        // sets the level up one level
        lvl += 1;

        // checks if level rewards exist
        if (!rewards[lvl]) {
            null;
        }
        else {
            const rRole = message.guild.roles.cache.find(role => role.id === rewards[lvl]);
            message.member.roles.add(rRole);
        }

        // checks if a level notification channel exists in the guild data import
        // if it doesn't exist, do nothing (return)
        if (!lvlchannelId) { return; }

        // checks if the lnc exists AND is a text channel
        // if it is, continue on
        else if (lvlchannel.type == '0') {

            // sets up the Congrats message!
            const lvlUpEmbed = new EmbedBuilder()
                .setTimestamp(+new Date())
                .setTitle('Level Up!')
                .setAuthor({ name: nickname, iconURL: avatar })
                .setDescription(`Congrats, ${iUser}!\nYou have levelled up to ${lvl}`)
                .setColor('Green');

            lvlchannel.send({ embeds: [lvlUpEmbed] });
        }

        // if neither condition is true, do nothing
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
        const leveldata = 'data/leveldata.json';
        const ldImport = JSON.parse(fs.readFileSync(leveldata));
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

        if (message.author.bot) return false;

        generateData(defaultSettings, guilddata, gdImport, leveldata, ldImport, guildId, userId, iUser, nickname, avatar);

        // checks if the guild data features active guildimport data
        // if it does, use the level progress function
        if (gdImport[guildId].levels == true) {
            progressLvl(gdImport, leveldata, ldImport, guildId, userId, message);
        }

        // an embed that replies to any ping towards prizmo
        const repEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date())
            .setTitle('Prizmo365')
            .setDescription('Hello! I\'m Prizmo, your friendly neighborhood assisant!\nIf you\'d like to use one of my commands, type in the `/` key without anything before it and start looking!\n(A `/help` command is coming in the future, I promise!)',
            )
            .setColor('#17ac86');

        // checks if the ping has the bot's id;
        // if it has the id (and not @everyone or @here) then it will send the message
        // elsewise, no message will be sent
        if (message.mentions.has(clientId) && !message.mentions.everyone) {
            message.reply({ embeds: [repEmbed], ephemeral: true });
        }
    },
};