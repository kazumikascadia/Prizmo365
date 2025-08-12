const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { returnError } = require('../../events/error.js');
const { clientId } = require('../../config.json');
const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');

function toTitleCase(w) {
    const wArr = w.toLowerCase().split(' ');
    let title = [], word, fL, i = 0;

    while (wArr[i]) {
        if (wArr[i].startsWith('(') || wArr[i].endsWith(')')) {
            word = wArr[i].toUpperCase();
        }
        else {
            word = wArr[i].split('');
            fL = word[0].toUpperCase();
            word = word.slice(1).join('');
            word = fL + word;
        }
        title.push(word);
        i++;
    }
    title = title.join(' ');
    return title;
}

function createColor(c, interaction) {
    const c2 = c.value ?? c;
    let hex;
    if (c2.includes('#') && c2.length == 7) {
        const c3 = c2.slice(c2.indexOf('#') + 1, c2.indexOf('#') + 7);
        hex = parseInt('0x' + c3);
    }
    else {
        returnError(interaction, 'No such color exists!');
        hex = false;
    }

    return hex;
}

function grabColor(c, interaction, rclImport) {
    const color = c.value.toUpperCase();
    let hex;
    const c2 = rclImport[color];
    if (c2.includes('#') && c2.length == 7) {
        const c3 = c2.slice(c2.indexOf('#') + 1, c2.indexOf('#') + 7);
        hex = parseInt('0x' + c3);
    }
    else {
        returnError(interaction, 'No such color exists!');
        hex = false;
    }

    return hex;
}

function createImage(c, subcommand) {
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');
    let c2;
    if (subcommand == 'create-from-library') { c2 = c; }
    if (subcommand == 'create-from-hex') { c2 = c.value ?? c; }
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

async function findHighestRole(interaction) {
    const guild = await interaction.guild.fetch();
    guild.members.fetch(); guild.roles.fetch();
    const botRole = interaction.guild.members.cache.find(m => m.id === clientId).roles.highest.position;
    const posit = interaction.member.roles.cache.filter(r => r.name !== '@everyone').sort((a, b) => b.position - a.position).filter(r => r.color != 0)
        .filter(r => r.position < botRole).map(r => r.rawPosition)[0];
    return posit;
}

async function createColorRole(interaction, color, posit) {
    let roles = await interaction.guild.fetch(true).then(guild => guild.roles.fetch());
    let uRole;

    if (!roles.find(r => r.name === `${interaction.user.username}`)) {
        interaction.guild.roles.create({ name: `${interaction.user.username}`, color: color, position: posit + 1 });
        roles = await interaction.guild.fetch().then(guild => guild.roles.fetch());
        uRole = roles.find(r => r.name === `${interaction.user.username}`);
    }
    else {
        uRole = roles.find(r => r.name === `${interaction.user.username}`);
        uRole.edit({ color: color, position: posit });
    }
    interaction.member.roles.add(uRole);
}

function createColorList(rclImport) {
    const colorList = [];
    for (let i in rclImport) {
        colorList.push(toTitleCase(i));
    }
    return colorList;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolecolor')
        .setDescription('Create and modify color roles!')
        .addSubcommand(s =>
            s.setName('create-from-library')
                .setDescription('Create a new color role of your liking.')
                .addStringOption(o =>
                    o.setName('color')
                        .setDescription('The color you want. Choose from a library of preset colors!')
                        .setAutocomplete(true)
                        .setRequired(true),
                ),
        )
        .addSubcommand(s =>
            s.setName('create-from-hex')
                .setDescription('Create a new color role of your liking.')
                .addStringOption(o =>
                    o.setName('color')
                        .setDescription('The color you want. Input a 7 character hex starting with #.')
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
    async autocomplete(interaction) {
        const roleColorList = 'database/rolecolors.json',
            rclImport = JSON.parse(fs.readFileSync(roleColorList));
        const colorList = await createColorList(rclImport);
        const focusedValue = interaction.options.getFocused();
        const choices = colorList;
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.slice(0, 25).map(choice => ({ name: choice, value: choice })),
        );
    },

    async execute(interaction) {
        const guilddata = 'data/guilddata.json',
            gdImport = JSON.parse(fs.readFileSync(guilddata));
        const guildId = interaction.guild.id;

        // checks if the command is active
        if (!gdImport[guildId] || !gdImport[guildId].colorroles || (gdImport[guildId].colorroles == false)) {
            returnError(interaction, 'Color roles are deactivated in this server!');
            return;
        }

        // sets up all necessary constants for the embed
        const crData = 'data/colorroledata.json',
            crImport = JSON.parse(fs.readFileSync(crData));
        const roleColorList = 'database/rolecolors.json',
            rclImport = JSON.parse(fs.readFileSync(roleColorList));
        createColorList(rclImport);
        const iUser = interaction.user;
        const uId = iUser.id;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const subcommand = interaction.options.getSubcommand();
        const name = interaction.options.get('name');
        const index = interaction.options.get('index');
        const c = interaction.options.get('color');
        let color;
        let attachment;
        let cList;
        let posit;
        const cEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());

        if (!crImport[uId]) {
            crImport[uId] = {};
            fs.writeFileSync(
                crData,
                JSON.stringify(crImport, null, 4),
            );
        }

        switch (subcommand) {
            case 'create-from-hex':
                color = createColor(c, interaction);
                if (color == false) { break; }
                attachment = createImage(c, subcommand, rclImport);
                posit = await findHighestRole(interaction);
                await createColorRole(interaction, color, posit);

                cEmbed.setTitle('Set your new Color Role!').setDescription(`Your color has been set to **${c.value.toUpperCase()}**.`).setColor(color).setImage('attachment://color.jpg');
                interaction.reply({ embeds: [cEmbed], files: [attachment] });
                break;

            case 'create-from-library':
                color = grabColor(c, interaction, rclImport);
                if (color == false) { break; }
                attachment = createImage(rclImport[c.value.toUpperCase()], subcommand, rclImport);
                posit = await findHighestRole(interaction);
                await createColorRole(interaction, color, posit);

                cEmbed.setTitle('Set your new Color Role!').setDescription(`Your color has been set to **${toTitleCase(c.value)} (${rclImport[c.value.toUpperCase()]})**.`).setColor(color).setImage('attachment://color.jpg');
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
                if (crImport === null) {
                    returnError('No colors to import.');
                    break;
                }
                sortList(crImport, uId, cList);
                cList = cList.map(i => [`**${cList.indexOf(i) + 1}.** ${i}`]);
                await iUser.fetch(true);

                cEmbed.setTitle(`Role Colors for ${nickname}`).setDescription(`${cList.join('\n')}`).setColor(iUser.hexAccentColor);

                interaction.reply({ embeds: [cEmbed] });
                break;

            case 'import':
                color = createColor(crImport[uId][index.value], interaction);
                if (color == false) { break; }
                attachment = createImage(crImport[uId][index.value]);
                posit = await findHighestRole(interaction);
                await createColorRole(interaction, color, posit);

                cEmbed.setColor(color).setTitle('Successful Import').setDescription(`Successfully imported your color **${crImport[uId][index.value].split(': ')[0]}**: 
                    ${crImport[uId][index.value].split(': ')[1]}.`).setImage('attachment://color.jpg');
                interaction.reply({ embeds: [cEmbed], files: [attachment] });
                break;
        }
    },
};