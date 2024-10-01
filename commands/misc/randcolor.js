const { createCanvas } = require('@napi-rs/canvas');
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcolor')
        .setDescription('Generates a random hexadecimal color.'),
    async execute(interaction) {
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const colorEmbed = new EmbedBuilder()
            .setTitle('A randomly generated color!')
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }

        const allOpts = 'abcdef';
        let hex = '';
        let index;
        let newI;

        for (let i = 0; i < 6; i++) {
            const pnt = getRandomInt(2);
            if (pnt == 0) {
                index = getRandomInt(allOpts.length);
                newI = allOpts[index];
            }
            else {
                newI = getRandomInt(10);
            }
            hex = hex + newI;
        }

        const fieldColor = '0x' + hex;

        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#' + hex;
        ctx.fillRect(0, 0, 500, 500);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/jpeg'), { name: 'color.jpg' });

        colorEmbed.setDescription(`Your randomly generated color is **#${hex}**.`).setColor(parseInt(fieldColor.toUpperCase())).setImage('attachment://color.jpg');
        interaction.reply({ embeds: [colorEmbed], files: [attachment] });
    },

};