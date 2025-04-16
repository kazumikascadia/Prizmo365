const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');

function createColor(c) {
    const c2 = c.value ?? c;
    let color;
    if (c2.includes('#')) {
        const cIndex = c2.indexOf('#');
        const cValue = c2.slice(cIndex + 1, cIndex + 7);
        color = parseInt('0x' + cValue);
    }
    // else if (clImport[c.toTitle]) {
    //     color = clImport[c].hex;
    // }
    else {
        color = 'null';
    }

    return color;
}

function createImage(c) {
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');
    const c2 = c.value ?? c;
    const cIndex = c2.indexOf('#');
    const hex = c2.slice(cIndex + 1, cIndex + 7);
    ctx.fillStyle = '#' + hex;
    ctx.fillRect(0, 0, 500, 500);

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/jpeg'), { name: 'color.jpg' });
    return attachment;
}

function sortList(crImport, uId, list) {
    const cList = crImport[uId];
    let val;
    for (const x in cList) {
        const cName = cList[x].split(': ')[0];
        const cColor = cList[x].split(': ')[1];

        val = `${cName}: ${cColor}`;
        list.push(val);
    }
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
                .addNumberOption(o =>
                    o.setName('index')
                        .setDescription('The index of the color you want to save. You should check your list before changing this!')
                        .setMaxValue(20)
                        .setMinValue(1)
                        .setRequired(true),
                )
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
                ),
        )
        .addSubcommand(s =>
            s.setName('import')
                .setDescription('Imports a saved color role. Can be used in place of create.')
                .addNumberOption(o =>
                    o.setName('index')
                        .setDescription('The index of your color in the list of saved colors.')
                        .setMaxValue(20)
                        .setMinValue(1)
                        .setRequired(true),
                ),
        ),
    async execute(interaction) {
        // sets up all necessary constants for the embed
        const crData = 'data/colorroledata.json',
            crImport = JSON.parse(fs.readFileSync(crData));
        const colorList = 'database/colors.json',
            clImport = JSON.parse(fs.readFileSync(colorList));
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
        let color;
        let attachment;
        let mRoles;
        let cList;
        const cEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());

        let roles = await interaction.guild.fetch().then(guild => guild.roles.fetch());
        let uRole;

        if (!crImport[uId]) {
            crImport[uId] = {};
            fs.writeFileSync(
                crData,
                JSON.stringify(crImport, null, 4),
            );
        }

        switch (subcommand) {
            case 'create':
                color = createColor(c);
                attachment = createImage(c);
                mRoles = gUser.roles.cache.filter(r => r.color !== '0').map(r => `${r}`);
                console.log(mRoles);
                if (color == 'null') {
                    cEmbed.setTitle('Failed!').setDescription('Can\'t catch that color! Try again!').setColor('Red');
                    return interaction.reply({ embeds: [cEmbed] });
                }

                cEmbed
                    .setTitle('Set your new Color Role!')
                    .setDescription(`Your color has been set to ${c.value}`)
                    .setColor(color)
                    .setImage('attachment://color.jpg');

                if (!roles.find(r => r.name === `${iUser.username}`)) {
                    server.roles.create({ name: `${iUser.username}`, color: color, position: gUser.roles.highest.position + 1 });
                    roles = await interaction.guild.fetch().then(guild => guild.roles.fetch());
                    uRole = roles.find(r => r.name === `${iUser.username}`);
                }
                else {
                    uRole = roles.find(r => r.name === `${iUser.username}`);
                    uRole.edit({ color: color, position: gUser.roles.highest.position });
                }
                await gUser.roles.add(uRole);

                interaction.reply({ embeds: [cEmbed], files: [attachment] });
                break;

            case 'save':
                color = createColor(c);

                crImport[uId][index.value] = `${name.value}: ${c.value}`;
                fs.writeFileSync(
                    crData,
                    JSON.stringify(crImport, null, 4),
                );

                cEmbed.setColor(color).setTitle('Saved!').setDescription(`Successfully saved the color ${c.value} with the name ${name.value}.`);
                interaction.reply({ embeds: [cEmbed] });
                break;

            case 'list':
                cList = [];
                sortList(crImport, uId, cList);
                cList = cList.map(i => [`**${cList.indexOf(i) + 1}.** ${i}`]);
                await iUser.fetch(true);

                cEmbed.setTitle(`Role Colors for ${nickname}`).setDescription(`${cList.join('\n')}`).setColor(iUser.hexAccentColor);

                interaction.reply({ embeds: [cEmbed] });
                break;

            case 'import':
                color = createColor(crImport[uId][name.value]);
                attachment = createImage(crImport[uId][name.value]);
                roles = await interaction.guild.fetch().then(guild => guild.roles.fetch());

                if (!roles.find(r => r.name === `${iUser.username}`)) {
                    server.roles.create({ name: `${iUser.username}`, color: color, position: gUser.roles.highest.position + 1 });
                    roles = await interaction.guild.fetch().then(guild => guild.roles.fetch());
                    uRole = roles.find(r => r.name === `${iUser.username}`);
                }
                else {
                    uRole = roles.find(r => r.name === `${iUser.username}`);
                    uRole.edit({ color: color, position: gUser.roles.highest.position });
                }
                await gUser.roles.add(uRole);

                cEmbed.setColor(color).setTitle('Successful Import').setDescription(`Successfully imported your color ${name.value}: ${crImport[uId][name.value]}.`).setImage('attachment://color.jpg');
                interaction.reply({ embeds: [cEmbed], files: [attachment] });
                break;
        }
    },
};