// work in progress

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embedify')
        .setDescription('Creates an embed for you! The embed must be less than 1000 characters.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild) // sets the required permissions set to Manage Guild (meaning the user must have the ability to manage the server)
        .addStringOption(o =>
            o.setName('title')
            .setDescription('The title of the embed you want to create.')
            .setRequired(true),
        )
        .addStringOption(o =>
            o.setName('information')
            .setDescription('Set the information you want to put in!')
            .setMaxLength(1000)
            .setRequired(true),
        )
        .addStringOption(o =>
            o.setName('color')
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
    async execute(interaction) {
        // grab the default necessities
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
    },
};