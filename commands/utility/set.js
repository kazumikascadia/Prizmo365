/* eslint-disable quotes */
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js'), fs = require('fs'), { serverData } = require('../../data/serverdata.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Allows the user to set server settings.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('initiate')
                .setDescription('Initiates server settings.'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('servercolor')
                .setDescription('Allows you to set the servercolor.')
                .addStringOption(option =>
                    option
                        .setName('option')
                        .setRequired(true)
                        .setDescription('Color of your choosing')
                        .addChoices(
                            { name: 'Blue', value: 'Blue' },
                            { name: 'Green', value: 'Green' },
                            { name: 'Red', value: 'Red' },
                        ),
                ),
        ),
    async execute(interaction) {
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        const defaultSettings = {
            'servercolor': '',
        };

        if (subcommand == 'initiate') {
            if (!serverData[guildId]) {
                serverData[guildId] = defaultSettings;
                fs.writeFileSync(
                    serverData,
                    JSON.stringify(serverData, null, 2),
                );
            }
        }

        interaction.reply('assurance');
    },

};