const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const crData = 'data/colorroledata.json',
    crImport = JSON.parse(fs.readFileSync(crData));
const colorList = 'database/colors.json',
    clImport = JSON.parse(fs.readFileSync(colorList));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolecolor')
        .setDescription('Create and modify color roles!')
        .addSubcommand(s =>
            s.setName('create')
                .setDescription('Create a new color role of your liking.')
                .addStringOption(o =>
                    o.setName('color')
                        .setDescription('The color you want. You can either use a preset color or a hex color.')
                        .setRequired(true),
                ),
        )
        .addSubcommand(s =>
            s.setName('list')
                .setDescription('A list of all of your saved colors!'),
        )
        .addSubcommand(s =>
            s.setName('save')
                .setDescription('Save a color of your liking.')
                .addStringOption(o =>
                    o.setName('name')
                        .setDescription('The name of your color.')
                        .setMaxLength(10)
                        .setMinLength(1)
                        .setRequired(true),
                )
                .addStringOption(o =>
                    o.setName('color')
                        .setDescription('The actual color you want. You can either use a preset color or a hex color.')
                        .setRequired(true),
                )
                .addNumberOption(o =>
                    o.setName('index')
                        .setDescription('The index of the color you want to save. If you ')
                        .setMaxValue(10)
                        .setMinValue(1)
                        .setRequired(true),
                ),
        )
        .addSubcommand(s =>
            s.setName('import')
                .setDescription('Imports a saved color role. Can be used in place of create.')
                .addNumberOption(o =>
                    o.setName('index')
                        .setDescription('The index of the color you want to import.')
                        .setMaxValue(10)
                        .setMinValue(1)
                        .setRequired(true),
                ),
        ),
    async execute(interaction) {
        // sets up all necessary constants for the embed
        const iUser = interaction.user;
        const uId = iUser.id;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild.fetch();

        if (!crImport[uId]) {
            crImport[uId] = {
                '1': {},
                '2': {},
                '3': {},
                '4': {},
                '5': {},
                '6': {},
                '7': {},
                '8': {},
                '9': {},
                '10': {},
            };
            fs.writeFileSync(
                crData,
                JSON.stringify(crImport, null, 4),
            );
        }

        switch (subcommand) {
            case 'create':
                const color = interaction.options.get('color');
                break;
            case 'save':
                break;
            case 'list':
                interaction.reply('Yippee!!!!!');
                break;
            case 'import':
                break;
        }
    },
};