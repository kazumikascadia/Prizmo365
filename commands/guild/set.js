/* eslint-disable quotes */
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js'), fs = require('fs');

function writeData(d, i) {
    fs.writeFileSync(
        d,
        JSON.stringify(i, null, 2),
    );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Allows the user to set server settings. Requires Manage Guild Permissions.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('servercolor')
                .setDescription('Allows you to set the servercolor.')
                .addStringOption(option =>
                    option
                        .setName('color')
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
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('starboard')
                .setDescription('Allows you to set up the server starboard.')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('Starboard Channel of your choosing.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true),
                )
                .addIntegerOption(option =>
                    option
                        .setName('starcount')
                        .setDescription('The amount of required stars.')
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('suggestionschannel')
                .setDescription('Allows you to set up a suggestions channel.')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('Sets the channel you want to be the suggestions channel.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('levels')
                .setDescription('Allows you to set up levels in your server!')
                .addBooleanOption(option =>
                    option
                        .setName('active')
                        .setDescription('Whether levels are on or off.')
                        .setRequired(true),
                )
                .addChannelOption(option =>
                    option
                        .setName('levelschannel')
                        .setDescription('The channel where you want level notifications to be sent.')
                        .addChannelTypes(ChannelType.GuildText),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('lvlrewards')
                .setDescription('Allows you to set up level rewards in your server!')
                .addIntegerOption(option =>
                    option
                        .setName('level')
                        .setDescription('The level you want the reward to be given at.')
                        .setRequired(true),
                )
                .addRoleOption(option =>
                    option
                        .setName('reward')
                        .setDescription('The reward you want this level to give.')
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('colorroles')
                .setDescription('Allows you to set up user role colors in your server!')
                .addBooleanOption(o => o
                    .setName('active')
                    .setDescription('Whether levels are turned on or off')
                    .setRequired(true),
                ),
        ),
    async execute(interaction) {
        const guilddata = 'data/guilddata.json';
        const gdImport = JSON.parse(fs.readFileSync(guilddata));
        const lvldata = 'data/leveldata.json';
        const ldImport = JSON.parse(fs.readFileSync(lvldata));
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;
        const setEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());

        if (!gdImport[guildId]) {
            const defaultSettings = {
                'owner': `${interaction.guild.ownerId}`,
            };
            gdImport[guildId] = defaultSettings;
            writeData(guilddata, gdImport);
            console.log(`Guild ${interaction.guild.name} added to database, ID${guildId}`);
        }

        if (subcommand == 'servercolor') {
            const chColor = interaction.options.getString('color');
            let nColor;

            if (chColor !== 'Random ❓ (random color)') {
                const cIndex = chColor.indexOf('#');
                const cValue = chColor.slice(cIndex + 1, cIndex + 7);

                nColor = parseInt('0x' + cValue);
            }
            else { nColor = 'Random'; }

            gdImport[guildId].color = nColor;
            writeData(guilddata, gdImport);

            setEmbed.setDescription(`Server color changed to ${chColor}.`).setColor(nColor);
            interaction.reply({ embeds: [setEmbed], ephemeral: true });
        }

        if (subcommand == 'starboard') {
            const starChannel = interaction.options.getChannel('channel');
            const starChannelId = starChannel.id;
            const reqStars = interaction.options.getInteger('starcount').toString();

            gdImport[guildId].starboardchannel = starChannelId;
            gdImport[guildId].requiredstars = reqStars;
            writeData(guilddata, gdImport);

            const channelEmbed = new EmbedBuilder()
                .setDescription('This channel has been set to receive starboard messages!')
                .setFooter({ text: `Channel ID: ${starChannelId}` })
                .setColor('Gold')
                .setTimestamp(+new Date());

            if (interaction.guild.channels.cache.get(starChannelId).type == '0') {
                setEmbed.setDescription(`Starboard channel set to **${starChannel}** with a required amount of **${reqStars}**.`).setColor('Gold');

                starChannel.send({ embeds: [channelEmbed] });
            }
            else {
                setEmbed.setDescription(`Starboard channel set to **${starChannel}** with a required amount of **${reqStars}**.\n However, since that is not a text channel, the starboard will not work.`).setColor('Red');
            }

            interaction.reply({ embeds: [setEmbed], ephemeral: true });
        }

        if (subcommand == 'suggestionschannel') {
            const suggestChannel = interaction.options.getChannel('channel');
            const suggestChannelId = suggestChannel.id;

            gdImport[guildId].suggestionschannel = suggestChannelId;
            writeData(guilddata, gdImport);

            const channelEmbed = new EmbedBuilder()
                .setDescription('This channel has been set to receive suggestion messages!')
                .setFooter({ text: `Channel ID: ${suggestChannelId}` })
                .setColor('Green')
                .setTimestamp(+new Date());

            if (interaction.guild.channels.cache.get(suggestChannelId).type == '0') {
                setEmbed.setDescription(`Suggestions channel set to **${suggestChannel}**.`).setColor('Green');

                suggestChannel.send({ embeds: [channelEmbed] });
            }
            else {
                setEmbed.setDescription(`Suggestions channel set to **${suggestChannel}**.\n However, since that is not a text channel, the suggestions will not work.`).setColor('Red');
            }

            interaction.reply({ embeds: [setEmbed], ephemeral: true });
        }

        if (subcommand == 'levels') {
            const levelTrue = interaction.options.getBoolean('active');
            const levelchannel = interaction.options.getChannel('levelschannel');

            const confirmEmbed = new EmbedBuilder()
                .setDescription('This server has been set up to have an active level system!')
                .setColor('Green')
                .setTimestamp(+new Date());

            if (levelTrue == true) {
                gdImport[guildId].levels = 'true';
                writeData(guilddata, gdImport);

                if (!levelchannel) {
                    confirmEmbed.setDescription(`This server has been set up to have an active level system.\nHowever, since there is no level channel set, there will be no notifications when a user levels up.\nReuse the command to set this up again.`);
                    interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
                }
                else {
                    const levelchannelId = levelchannel.id;

                    const channelEmbed = new EmbedBuilder()
                        .setDescription('This channel has been set to receive level notification messages!')
                        .setFooter({ text: `Channel ID: ${levelchannelId}` })
                        .setColor('Green')
                        .setTimestamp(+new Date());

                    gdImport[guildId].levelchannel = levelchannelId;
                    writeData(guilddata, gdImport);

                    if (interaction.guild.channels.cache.get(levelchannelId).type == '0') {
                        confirmEmbed.setDescription(`This server has been set up to have an active level system!\nLevel notifications channel set to **${levelchannel}**.`);

                        levelchannel.send({ embeds: [channelEmbed] });
                    }
                    else {
                        setEmbed.setDescription(`Level notification channel set to **${levelchannel}**.\n However, since that is not a text channel, the level notifications will not work.`);
                    }

                    interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
                }
            }
            else {
                gdImport[guildId].levels = 'false';
                writeData(guilddata, gdImport);

                confirmEmbed.setDescription('Levels have been deactivated for this server.');

                interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }
        }

        if (subcommand == 'lvlrewards') {
            const lvl = interaction.options.getInteger('level');
            const role = interaction.options.getRole('reward');

            const confirmEmbed = new EmbedBuilder()
                .setTimestamp(+new Date());

            if (interaction.guild.roles.cache.get(`${role.id}`)) {
                if (!ldImport[guildId].rewards) {
                    return false;
                }
                else {
                    ldImport[guildId].rewards[lvl] = role.id;
                    writeData(lvldata, ldImport);
                }

                confirmEmbed.setDescription(`${role} has been set as the reward for level ${lvl} in this server.`).setColor('Green');
                interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }
            else {
                confirmEmbed.setDescription('That role does not exist, so it was unable to be set.').setColor('Red');
                interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }
        }

        if (subcommand == 'colorroles') {
            const colorBoolean = interaction.options.getBoolean('active');
            const confirmEmbed = new EmbedBuilder()
                .setTimestamp(+new Date());

            if (colorBoolean == true) {
                gdImport[guildId].colorroles = 'true';
                writeData(guilddata, gdImport);

                confirmEmbed.setDescription('Color roles have been activated in this server.').setColor('Green');
                interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }
            else {
                gdImport[guildId].colorroles = 'false';
                writeData(guilddata, gdImport);

                confirmEmbed.setDescription('Color roles have been deactivated in this server.').setColor('Red');
                interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }
        }
    },
};