// work in progress

const { SlashCommandBuilder, EmbedBuilder, Guild } = require('discord.js');

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
            const mavatar = mUser.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }) || mUser.defaultAvatarURL({ dynamic: true, size: 960, format: 'png' });
            const gUser = server.members.fetch(uid);
            const accentColor = mUser.hexAccentColor;
            const roles = gUser.roles;

            // setting up the embed
            infoEmbed
                .setTitle(`Info on ${mUser.nickname ?? mUser.displayName}...`)
                .setDescription(`${mUser} is currently set to ${mUser.presence}.`)
                .addFields(
                    { name: 'Roles:', value: `${roles}` },
                    { name: 'Joined Discord:', value: `${mUser.createdAt}`, inline: true },
                    { name: 'Joined Server:', value: `${gUser.joinedAt}`, inline: true },
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