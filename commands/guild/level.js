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

function sortUsers(ldImport, guildId, allUsers) {
    delete ldImport[guildId].rewards;

    for (let u in ldImport[guildId]) {
        // if (u.toString() == 'rewards') return false;
        u = [u, ldImport[guildId][u]];
        const uid = u[0];
        const info = u[1].split(';'),
            lvl = info[0],
            xp = info[1];

        let xpTot;
        let b = 0;
        switch (Number(lvl)) {
            case 0:
                xpTot = Number(xp);
                break;
            case 1:
                xpTot = 500 + Number(xp);
                break;
            default:
                for (let i = 1; i <= Number(lvl) + 1; i++) {
                    b += i * 500;
                }
                xpTot = b + Number(xp);
        }

        u = { uid: uid, xpTot: xpTot };

        allUsers.push(u);
    }

    allUsers.sort(function(a, b) { return b.xpTot - a.xpTot; });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Shows information about levels.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('progress')
                .setDescription('Shows a user\'s level progress.')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('The user who you want to see the progress of.'),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leaderboard')
                .setDescription('Shows a leaderboard of all levels for all members in a server.'),
        ),
    async execute(interaction) {
        const leveldata = 'data/leveldata.json',
            ldImport = JSON.parse(fs.readFileSync(leveldata));
        const guilddata = 'data/guilddata.json',
            gdImport = JSON.parse(fs.readFileSync(guilddata));
        const guildId = interaction.guild.id;
        const iUser = interaction.user;
        const mUser = await interaction.options.getUser('target') || iUser;
        const userId = await mUser.id;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const subcommand = interaction.options.getSubcommand();

        let gdColor;
        if (gdImport[guildId]) {
            if (gdImport[guildId].color == '') {
                gdColor == 'Green';
            }
            else { gdColor = gdImport[guildId].color; }
        }
        else { gdColor == 'Green'; }

        if (gdImport[guildId].levels == 'false') {
            const failEmbed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('Levels are disabled for this server. So sorry!')
                .setColor('Red')
                .setAuthor({ name: nickname, iconURL: avatar })
                .setTimestamp(+new Date());

            return interaction.reply({ embeds: [failEmbed], ephemeral: true });
        }

        const allUsers = [];
        sortUsers(ldImport, guildId, allUsers);

        if (subcommand == 'progress') {
            const uData = ldImport[guildId][userId].split(';');
            const lvl = Number(uData[0]); let uXp = Number(uData[1]);
            const reqXp = ((lvl + 1) * 500);
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
                const f = allUsers.findIndex(u => u.uid === mUser.id);
                lvlEmbed
                    .setColor(gdColor ?? 'Green')
                    .setTitle(`Level Progress for ${mUser.username}`)
                    .setDescription(`**Level ${lvl}** | **Rank ${f + 1}**\nProgress to Next: ${pBar}\nXP Progress to Next: ${uXp} / ${reqXp}`);
                interaction.reply({ embeds: [lvlEmbed] });
            }
        }

        if (subcommand == 'leaderboard') {
            const descI = allUsers.map(u => [`${allUsers.indexOf(u) + 1}. <@${u.uid}>: **Level ${ldImport[guildId][u.uid].split(';')[0]}** at **${ldImport[guildId][u.uid].split(';')[1]} XP** (total **${u.xpTot} XP**)`]).slice(0, 20);

            const lbdEmbed = new EmbedBuilder()
                .setTitle(`Leaderboard for ${interaction.guild.name}`)
                .setAuthor({ name: nickname, iconURL: avatar })
                .setTimestamp(+new Date())
                .setDescription(`**Top ${descI.length} Members**\n${descI.join('\n')}`)
                .setColor(gdColor ?? 'Green');

            interaction.reply({ embeds: [lbdEmbed] });
        }
    },
};