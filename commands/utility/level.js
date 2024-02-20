const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js'), fs = require('fs');

function createPBar(reqXp, uXp) {
    let pBar = '[';
    if (uXp == 0) {
        pBar = '[░░░░░░░░░░]';
        return pBar;
    }
    const fPer = Math.floor((uXp / reqXp) * 10);
    const dPer = Math.floor(10 - fPer);

    const f = '▓';
    const d = '░';

    for (let i = fPer; i > 0; i--) {
        pBar += f;
    }
    for (let i = dPer; i > 0; i--) {
        pBar += d;
    }

    pBar += ']';

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

        const uData = ldImport[guildId][userId].split(';');
        const lvl = Number(uData[0]); let uXp = Number(uData[1]);
        const reqXp = ((lvl + 1) * 150);
        if (uXp == 0) uXp = '0';

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
                    `**Level ${lvl}**
                    Progress to Next: ${pBar}
                    XP Progress to Next: ${uXp} / ${reqXp}`,
                );
            interaction.reply({ embeds: [lvlEmbed] });
        }
    },
};