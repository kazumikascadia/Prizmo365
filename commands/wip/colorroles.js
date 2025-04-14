const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const crData = 'data/colorroledata.json',
    crImport = JSON.parse(fs.readFileSync(crData));
const colorList = 'database/colors.json',
    clImport = JSON.parse(fs.readFileSync(colorList));

function createColor(c) {
    let color;
    if (c.value.includes('#')) {
        const cIndex = c.value.indexOf('#');
        const cValue = c.value.slice(cIndex + 1, cIndex + 7);
        color = parseInt('0x' + cValue);
    }
    else if (clImport[c.toTitle]) {
        color = clImport[c].hex;
    }
    else {
        color = 'null';
    }

    return color;
}

function createImage(c) {
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');
    const cIndex = c.value.indexOf('#');
    const hex = c.value.slice(cIndex + 1, cIndex + 7);
    ctx.fillStyle = '#' + hex;
    ctx.fillRect(0, 0, 500, 500);

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/jpeg'), { name: 'color.jpg' });
    return attachment;
}

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
        const server = await interaction.guild.fetch(true);
        const iUser = interaction.user;
        const uId = iUser.id;
        const gUser = server.members.cache.get(uId);
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const subcommand = interaction.options.getSubcommand();
        const name = interaction.options.get('name');
        const index = interaction.options.get('index');
        const c = interaction.options.get('color');
        const cEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());
        const color = createColor(c, cEmbed);
        if (color == 'null') {
            cEmbed.setTitle('Failed!').setDescription('Can\'t catch that color! Try again!').setColor('Red');
            return interaction.reply({ embeds: [cEmbed] });
        }
        const attachment = createImage(c);

        let roles = await interaction.guild.fetch().then(guild => guild.roles.fetch());
        // console.log(roles);
        let uRole;

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
                if (!roles.find(r => r.name === `${iUser.username}`)) {
                    server.roles.create({ name: `${iUser.username}`, color: color });
                }
                else {
                    uRole = roles.find(r => r.name === `${iUser.username}`);
                    uRole.edit({ color: color });
                }
                cEmbed
                    .setTitle('Set your new Color Role!')
                    .setDescription(`Your color has been set to ${color}`)
                    .setImage('attachment://color.jpg');

                roles = await interaction.guild.fetch().then(guild => guild.roles.fetch());
                uRole = roles.find(r => r.name === `${iUser.username}`);
                uRole.edit({ position: gUser.roles.highest.position });
                await gUser.roles.add(uRole);
                interaction.reply({ embeds: [cEmbed], files: [attachment] });
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