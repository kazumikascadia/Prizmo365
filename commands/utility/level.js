const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js'), fs = require('fs');

function createPBar(reqXp, uXp) {
    const lPer = ((uXp / reqXp) * 100);

    const f = '▓';
    const d = '░';

    let pBar;

    while (lPer > 0)

    return pBar;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Shows information about levels.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('progress')
                .setDescription('Shows a user\'s level progress.')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('The user who you want to see the progress of.'),
                ),
        ),
    async execute(interaction) {
        const leveldata = 'data/leveldata.json',
            ldImport = JSON.parse(fs.readFileSync(leveldata));
        const guildId = interaction.guild.id;
        const iUser = interaction.user;
        const mUser = await interaction.options.getUser('target') || iUser;
        const userId = await mUser.id;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();

        const uXp = ldImport[guildId][userId];
        const l = Math.floor(uXp / 150);
        const reqXp = Math.floor((l + 1) * 150);
        console.log(l, reqXp, uXp);

        const lvlEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());

        const pBar = createPBar(reqXp, uXp);

        if (!uXp) {
            lvlEmbed
                .setColor('Red')
                .setTitle('Error!')
                .setDescription('The specified user has no level!');
            interaction.reply({ embeds: [lvlEmbed], ephemeral: true });
        }
        else {
            lvlEmbed
                .setColor('Green')
                .setTitle(`Level Progress for ${mUser.username}`)
                .setDescription(
                    `**Level ${l}**
                    Progress to Next: ${pBar}
                    XP Progress to Next: ${uXp} / ${reqXp}`,
                );
            interaction.reply({ embeds: [lvlEmbed] });
        }
    },
};