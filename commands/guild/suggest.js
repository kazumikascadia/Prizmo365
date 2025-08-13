const { EmbedBuilder, SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { token } = require('../../config.json');
const { returnError } = require('../../events/error.js');

function writeData(data, iData) {
    fs.writeFileSync(
        data,
        JSON.stringify(iData, null, 2),
    );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Allows the user to suggest something to the server.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('new')
                .setDescription('Submits a new suggestion.')
                .addStringOption(option =>
                    option
                        .setName('suggestion')
                        .setDescription('The suggestion you want to submit.')
                        .setRequired(true),
                )
                .addBooleanOption(option =>
                    option
                        .setName('anonymous')
                        .setDescription('Decides if the message should be anonymous or not.')
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('approve')
                .setDescription('Approves a selected suggestion')
                .addStringOption(option =>
                    option
                        .setName('suggestionid')
                        .setDescription('The ID of the suggestion you want to accept.')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('comment')
                        .setDescription('The comment you want to provide to your acceptance message.')
                        .setMaxLength(1000),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('decline')
                .setDescription('Declines a selected suggestion.')
                .addStringOption(option =>
                    option
                        .setName('suggestionid')
                        .setDescription('The ID of the suggestion you want to decline.')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('comment')
                        .setDescription('The comment you want to provide to your acceptance message.')
                        .setMaxLength(1000),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('consider')
                .setDescription('Sets a selected suggestion as considered.')
                .addStringOption(option =>
                    option
                        .setName('suggestionid')
                        .setDescription('The ID of the suggestion you want to consider.')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('comment')
                        .setDescription('The comment you want to provide to your acceptance message.')
                        .setMaxLength(1000),
                ),
        ),
    async execute(interaction) {
        const { PermissionsBitField } = require('discord.js');
        const client = new Client({
            intents:
                [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildPresences,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.MessageContent,
                    GatewayIntentBits.GuildMessageReactions,
                ],
        });
        client.login(token);
        // imports guild data and suggestion data
        const guilddata = 'data/guilddata.json',
            gdImport = JSON.parse(fs.readFileSync(guilddata));
        const suggestdata = 'data/suggestdata.json',
            sdImport = JSON.parse(fs.readFileSync(suggestdata));
        const guildId = interaction.guild.id;
        const iUser = interaction.user,
            nickname = iUser.nickname ?? iUser.displayName,
            avatar = iUser.displayAvatarURL();

        // checks all requirements
        if (!gdImport[guildId] || !gdImport[guildId].suggestionschannel) {
            returnError(interaction, 'No suggestions channel found.'); return false;
        }
        if (!interaction.guild.channels.cache.get(gdImport[guildId].suggestionschannel)) return false;

        if (!sdImport[guildId]) {
            const format = {

            };
            sdImport[guildId] = format;
            writeData(suggestdata, sdImport);
        }

        const subcommand = interaction.options.getSubcommand();
        const suggestEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setColor('White')
            .setTimestamp(+new Date());
        const confirmEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setColor('Green')
            .setTimestamp(+new Date());
        const suggestChannel = interaction.guild.channels.cache.get(gdImport[guildId].suggestionschannel);

        // this is the subcommand for suggesting NEW suggestions
        if (subcommand == 'new') {
            // selects a new subcommand
            const suggestion = interaction.options.getString('suggestion');
            const anon = interaction.options.getBoolean('anonymous');
            const sid = interaction.id;
            let user = iUser.id;

            if (anon == true) {
                user = 'Anonymous';
                suggestEmbed.setAuthor({ name: 'Anonymous', iconURL: iUser.defaultAvatarURL });
            }

            suggestEmbed
                .setDescription(suggestion)
                .setTitle('New Suggestion')
                .setFooter({ text: `Suggestion ID: ${sid}` });

            const sFormat = {
                'content': suggestion,
                'user': user,
                'status': 'new',
            };
            sdImport[guildId][sid] = sFormat;
            writeData(suggestdata, sdImport);

            confirmEmbed.setDescription('Suggestion submitted.');
            const sMessage = await suggestChannel.send({ embeds: [suggestEmbed] });
            try {
                await sMessage.react('⬆️');
                await sMessage.react('⬇️');
            }
            catch (error) { console.error('message failed to react'); }
            interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        }

        // approval
        if (subcommand == 'approve') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                returnError(interaction, 'Lacking permissions!'); return;
            }

            const sid = interaction.options.getString('suggestionid');
            const sComm = interaction.options.getString('comment') || 'No admin comment.';

            if (!sdImport[guildId][sid]) {
                confirmEmbed.setDescription('This item does not exist!').setColor('Red');

                return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }

            const sinfo = sdImport[guildId][sid];
            let nAvatar, nName;

            if (sinfo.status !== 'new') {
                if (sinfo.status == 'considered') {
                    null;
                }
                else {
                    confirmEmbed.setDescription('A decision has already been made on this suggestion.').setColor('Red');

                    return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
                }
            }

            if (sinfo.user !== 'Anonymous') {
                const user = await client.users.fetch(sdImport[guildId][sid].user);
                nName = user.nickname ?? user.displayName;
                nAvatar = user.displayAvatarURL();
            }
            else {
                nAvatar = iUser.defaultAvatarURL;
                nName = 'Anonymous';
            }

            suggestEmbed
                .setTitle('Suggestion Approved')
                .setAuthor({ name: nName, iconURL: nAvatar })
                .setDescription(sinfo.content)
                .addFields({ name: `Approved by ${interaction.user.displayName}`, value: sComm })
                .setColor('Green')
                .setFooter({ text: `Suggestion ID: ${sid}` });

            sdImport[guildId][sid].status = 'approved';
            sdImport[guildId][sid].comment = sComm;
            writeData(suggestdata, sdImport);

            confirmEmbed.setDescription('Suggestion approved.');
            suggestChannel.send({ embeds: [suggestEmbed] });
            interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        }

        if (subcommand == 'decline') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                returnError(interaction, 'Lacking permissions!'); return;
            }

            const sid = interaction.options.getString('suggestionid');
            const sComm = interaction.options.getString('comment') || 'No admin comment.';

            if (!sdImport[guildId][sid]) {
                confirmEmbed.setDescription('This item does not exist!').setColor('Red');

                return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }

            const sinfo = sdImport[guildId][sid];
            let nAvatar, nName;

            if (sinfo.status !== 'new') {
                if (sinfo.status == 'considered') {
                    null;
                }
                else {
                    confirmEmbed.setDescription('A decision has already been made on this suggestion.').setColor('Red');

                    return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
                }
            }

            if (sinfo.user !== 'Anonymous') {
                const user = await client.users.fetch(sdImport[guildId][sid].user);
                nName = user.nickname ?? user.displayName;
                nAvatar = user.displayAvatarURL();
            }
            else {
                nAvatar = iUser.defaultAvatarURL;
                nName = 'Anonymous';
            }

            suggestEmbed
                .setTitle('Suggestion Declined')
                .setAuthor({ name: nName, iconURL: nAvatar })
                .setDescription(sinfo.content)
                .addFields({ name: `Denied by ${interaction.user.displayName}`, value: sComm })
                .setColor('Red')
                .setFooter({ text: `Suggestion ID: ${sid}` });

            sdImport[guildId][sid].status = 'declined';
            sdImport[guildId][sid].comment = sComm;
            writeData(suggestdata, sdImport);

            confirmEmbed.setDescription('Suggestion declined.');
            suggestChannel.send({ embeds: [suggestEmbed] });
            interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        }
        if (subcommand == 'consider') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                returnError(interaction, 'Lacking permissions!'); return;
            }

            const sid = interaction.options.getString('suggestionid');
            const sComm = interaction.options.getString('comment') || 'No admin comment.';

            if (!sdImport[guildId][sid]) {
                confirmEmbed.setDescription('This item does not exist!').setColor('Red');

                return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }

            const sinfo = sdImport[guildId][sid];
            let nAvatar, nName;

            if (sinfo.status == 'considered') {
                confirmEmbed.setDescription('This decision is already being considered.').setColor('Red');

                return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }
            if (sinfo.status !== 'new') {
                confirmEmbed.setDescription('A decision has already been made on this suggestion.').setColor('Red');

                return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
            }

            if (sinfo.user !== 'Anonymous') {
                const user = await client.users.fetch(sdImport[guildId][sid].user);
                nName = user.nickname ?? user.displayName;
                nAvatar = user.displayAvatarURL();
            }
            else {
                nAvatar = iUser.defaultAvatarURL;
                nName = 'Anonymous';
            }

            suggestEmbed
                .setTitle('Suggestion Considered')
                .setAuthor({ name: nName, iconURL: nAvatar })
                .setDescription(sinfo.content)
                .addFields({ name: `Considered by ${interaction.user.displayName}`, value: sComm })
                .setColor('Blue')
                .setFooter({ text: `Suggestion ID: ${sid}` });

            sdImport[guildId][sid].status = 'considered';
            sdImport[guildId][sid].comment = sComm;
            writeData(suggestdata, sdImport);

            confirmEmbed.setDescription('Suggestion marked as considered.');
            suggestChannel.send({ embeds: [suggestEmbed] });
            interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        }
    },
};