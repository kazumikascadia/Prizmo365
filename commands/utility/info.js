// work in progress

const { SlashCommandBuilder, EmbedBuilder, Guild } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides info on the chosen object.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Provides info on a specific user.'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Provides info on the overall server.'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Provides info on the bot.'),
        ),
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

        // fetched user information

        // fetched server information
        const serverIcon = Guild.iconURL;
        const serverName = Guild.name;

        // fetched bot information

        // selects the specific command
        // if (subcommand === 'user') {

        // }
        if (subcommand === 'server') {
            infoEmbed
                .setTitle(serverName)
                .setThumbnail(serverIcon)
                .setDescription('You are a part of this server.');
        }
        // if (subcommand === 'bot') {

        // }
    },
};