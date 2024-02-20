/* eslint-disable quotes */
const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js'), fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Allows the user to set server settings.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
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
                        .setDescription('The channel where you want level notifications to be sent.'),
                ),
        ),
    async execute(interaction) {
        const guilddata = 'data/guilddata.json';
        const gdImport = JSON.parse(fs.readFileSync(guilddata));
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
                'color': '',
                'levels': 'false',
                'welcomechannel': '',
                'exitchannel': '',
                'autorole': '',
                'suggestionschannel': '',
                'starboardchannel': '',
                'requiredstars': '',
            };
            gdImport[guildId] = defaultSettings;
            fs.writeFileSync(
                guilddata,
                JSON.stringify(gdImport, null, 4),
            );
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
            fs.writeFileSync(
                guilddata,
                JSON.stringify(gdImport, null, 2),
            );

            setEmbed.setDescription(`Server color changed to ${chColor}.`).setColor(nColor);
            interaction.reply({ embeds: [setEmbed], ephemeral: true });
        }

        if (subcommand == 'starboard') {
            const starChannel = interaction.options.getChannel('channel');
            const starChannelId = starChannel.id;
            const reqStars = interaction.options.getInteger('starcount').toString();

            gdImport[guildId].starboardchannel = starChannelId;
            gdImport[guildId].requiredstars = reqStars;
            fs.writeFileSync(
                guilddata,
                JSON.stringify(gdImport, null, 2),
            );

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
            fs.writeFileSync(
                guilddata,
                JSON.stringify(gdImport, null, 2),
            );

            const channelEmbed = new EmbedBuilder()
                .setDescription('This channel has been set to receive suggestion messages!')
                .setFooter({ text: `Channel ID: ${suggestChannelId}` })
                .setColor('Green')
                .setTimestamp(+new Date());

            if (interaction.guild.channels.cache.get(suggestChannelId).type == '0') {
                setEmbed.setDescription(`Suggestions channel set to **${suggestChannel}**.`);

                suggestChannel.send({ embeds: [channelEmbed] });
            }
            else {
                setEmbed.setDescription(`Suggestions channel set to **${suggestChannel}**.\n However, since that is not a text channel, the suggestions will not work.`);
            }

            interaction.reply({ embeds: [setEmbed], ephemeral: true });
        }

        if (subcommand == 'levels') {
            const levelTrue = interaction.options.getBoolean('active');
            console.log(levelTrue);
            const levelchannel = interaction.options.getChannel('levelschannel');

            const confirmEmbed = new EmbedBuilder()
                .setDescription('This server has been set up to have an active level system!')
                .setColor('Green')
                .setTimestamp(+new Date());

            if (levelTrue == true) {
                gdImport[guildId].levels == 'true';
                fs.writeFileSync(
                    guilddata,
                    JSON.stringify(gdImport, null, 2),
                );

                if (!levelchannel) {
                    confirmEmbed.setDescription(`This server has been set up to have an active level system.
                        However, since there is no level channel set, there will be no notifications when a user levels up.
                        Reuse the command to set this up again.`,
                    );
                    interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
                }
                else {
                    const channelEmbed = new EmbedBuilder()
                        .setDescription('This channel has been set to receive level notification messages!')
                        .setFooter({ text: `Channel ID: ${levelchannelId}` })
                        .setColor('Green')
                        .setTimestamp(+new Date());

                    const levelchannelId = levelchannel.id;

                    gdImport[guildId].levelchannel == levelchannelId;
                    fs.writeFileSync(
                        guilddata,
                        JSON.stringify(gdImport, null, 2),
                    );

                    if (interaction.guild.channels.cache.get(levelchannelId).type == '0') {
                        confirmEmbed.setDescription(
                            `This server has been set up to have an active level system!
                        Level notifications channel set to **${levelchannel}**.`,
                        );

                        levelchannel.send({ embeds: [channelEmbed] });
                    }
                    else {
                        setEmbed.setDescription(`Suggestions channel set to **${levelchannel}**.\n However, since that is not a text channel, the suggestions will not work.`);
                    }

                    interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
                }
            }
            else {
                gdImport[guildId].levels == 'false';
                fs.writeFileSync(
                    guilddata,
                    JSON.stringify(gdImport, null, 2),
                );

                confirmEmbed.setDescription(`Levels have been deactivated for this server.`);

                interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }
        }
    },
};