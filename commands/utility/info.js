// work in progress

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'), moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides info on the chosen object.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Provides info on a specific user.')
                .addUserOption(option => option.setName('target').setRequired(true).setDescription('A specified user.')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Provides info on the overall server.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Provides info on the bot.')),
    async execute(interaction) {
        // user information
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();

        // setup
        const subcommand = interaction.options.getSubcommand();
        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());

        // fetched server information
        const server = interaction.guild;
        const serverIcon = server.iconURL;
        const serverName = server.name;

        // fetched bot information

        // selects the specific command
        if (subcommand === 'user') {
            // fetch user info
            const mUser = await interaction.options.getUser('target').fetch(true) || iUser.fetch(true);
            const uid = mUser.id;
            const mavatar = mUser.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }) ?? mUser.defaultAvatarURL({ dynamic: true, size: 960, format: 'png' });
            const gUser = server.members.cache.get(uid);
            const accentColor = mUser.hexAccentColor;
            let roles = gUser.roles.cache.filter(r => r.name !== '@everyone').map(r => `${r}`).join(', ');
            let rLength = roles.split(', ').length;
            const flags = {
                ActiveDeveloper: 'Active Developer',
                BugHunterLevel1: 'Bug Hunter Level 1',
                BugHunterLevel2: 'Bug Hunter Level 2',
                CertifiedModerator: 'Certified Moderator Alumni',
                HypeSquadOnlineHouse1: 'House Bravery Member',
                HypeSquadOnlineHouse2: 'House Brilliance Member',
                HypeSquadOnlineHouse3: 'House Balance Member',
                HypeSquad: 'HypeSquad Events Member',
                Parnter: 'Partnered Server Owner',
                PremiumEarlySupporter: 'Early Nitro Supporter',
                Staff: 'Discord Employee',
                VerifiedBot: 'Verified Bot',
                VerifiedDeveloper: 'Verified Bot Developer',
            };
            const uFlags = mUser.flags.toArray();

            console.log(uFlags);

            if (`${roles}` == '') {
                roles = 'No roles';
                rLength = '0';
            }

            // setting up the embed
            infoEmbed
                .setTitle(mUser.username)
                .setDescription(`Known as ${mUser}`)
                .addFields(
                    { name: `Roles [${rLength}]:`, value: roles ?? 'No roles' },
                    { name: 'Flags:', value: `${uFlags.length ? uFlags.map(flag => flags[flag]).join(', ') : 'None'}` },
                    { name: 'Joined Discord:', value: `${moment.utc(mUser.createdAt).format('MMM Do, YYYY hh:mm A')} UTC (${moment.utc(mUser.createdAt).fromNow()})`, inline: true },
                    { name: 'Joined Server:', value: `${moment.utc(gUser.joinedAt).format('MMM Do, YYYY hh:mm A')} UTC (${moment.utc(gUser.joinedAt).fromNow()})`, inline: true },
                )
                .setColor(accentColor)
                .setImage(mavatar)
                .setFooter({ text: `ID: ${uid}` });
        }
        // if (subcommand === 'server') {
        //     infoEmbed
        //         .setTitle(serverName)
        //         .setThumbnail(serverIcon)
        //         .setDescription('You are a part of this server.');
        // }
        // if (subcommand === 'bot') {

        // }

        interaction.reply({ embeds: [infoEmbed] });
    },
};