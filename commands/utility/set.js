/* eslint-disable quotes */
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js'), fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Allows the user to set server settings.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
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
                            { name: 'Rose 🌹', value: 'Rose 🌹 (#a40620)' },
                            { name: 'Strawberry 🍓', value: 'Strawberry 🍓 (#f8312f)' },
                            { name: 'Mushroom 🍄', value: 'Mushroom 🍄 (#ea7284)' },
                            { name: 'Tulip 🌷', value: 'Tulip 🌷 (#f4abba)' },
                            { name: 'Peach 🍑', value: 'Peach 🍑 (#ff886c)' },
                            { name: 'Orange 🍊', value: 'Orange 🍊 (#f4900c)' },
                            { name: 'Banana 🍌', value: 'Banana 🍌 (#ffcf5b)' },
                            { name: 'Vanilla 🍦', value: 'Vanilla 🍦 (#ffe8b6)' },
                            { name: 'Grape 🍇', value: 'Grape 🍇 (#8e63c8)' },
                            { name: 'Blueberry 🫐', value: 'Blueberry 🫐 (#5864b7)' },
                            { name: 'Wave 🌊', value: 'Wave 🌊 (#55acee)' },
                            { name: 'Clover 🍀', value: 'Clover 🍀 (#89db59)' },
                            { name: 'Evergreen 🌲', value: 'Evergreen 🌲 (#3e721d)' },
                            { name: 'Coffee ☕', value: 'Coffee ☕ (#8a4b38)' },
                            { name: 'Salt 🧂', value: 'Salt 🧂 (#ffffff)' },
                            { name: 'Random ❓', value: 'Random ❓ (random color)' },
                            { name: 'Blurple 🎮', value: 'Blurple 🎮 (#5865F2)' },
                        ),
                ),
        ),
    async execute(interaction) {
        const serverData = 'data/serverdata.json';
        const iData = JSON.parse(fs.readFileSync(serverData));
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;
        const setEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());

        if (!iData[guildId]) {
            const defaultSettings = {
                'owner': `${interaction.guild.ownerId}`,
                'color': '',
                'levels': 'false',
                'welcomechannel': '',
                'exitchannel': '',
                'autorole': '',
                'suggestionschannel': '',
                'starboardchannel': '',
            };
            iData[guildId] = defaultSettings;
            fs.writeFileSync(
                serverData,
                JSON.stringify(iData, null, 4),
            );
        }

        if (subcommand == 'servercolor') {
            const chColor = interaction.options.getString('option');
            let nColor;

            if (chColor !== 'Random ❓ (random color)') {
                const cIndex = chColor.indexOf('#');
                const cValue = chColor.slice(cIndex + 1, cIndex + 7);

                nColor = parseInt('0x' + cValue);
            }
            else { nColor = 'Random'; }

            iData[guildId].color = nColor;
            fs.writeFileSync(
                serverData,
                JSON.stringify(iData, null, 2),
            );

            setEmbed.setDescription(`Server color changed to ${chColor}.`).setColor(nColor);
            interaction.reply({ embeds: [setEmbed] });
        }
    },

};