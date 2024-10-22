// on hold
const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jpegify')
        .setDescription('Turns an image into a jpeg... for whatever reason')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('The name you want for your image.')
                .setRequired(true),
        )
        .addAttachmentOption(o =>
            o.setName('image')
                .setDescription('The image you want to jpegify.')
                .setRequired(true),
        ),
    async execute(interaction) {
        // sets up all necessary constants for the embed
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const image = await interaction.options.getAttachment('image');
        const name = interaction.options.getString('name');
        const aEmbed = new EmbedBuilder()
            .setTitle('Jpegify')
            .setDescription(`The image you sent has been jpegified!\n\n__**File Name**: ${name}.jpg__`)
            .setAuthor({ name: nickname, iconURL: avatar })
            .setColor('Blue')
            .setTimestamp(+new Date());

        const attachment = new AttachmentBuilder(image.url, { name: `${name}.jpg`, description: 'A jpeg image.' });

        aEmbed.setImage(`attachment://${name}.jpg`);
        interaction.reply({ embeds: [aEmbed], files: [attachment] });
    },
};