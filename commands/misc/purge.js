const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, SnowflakeUtil } = require('discord.js');
const { DiscordSnowflake, Snowflake } = require('@sapphire/snowflake');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purges a collection of messages. Requires Manage Guild Permissions.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild) // sets the command to require manage guild permissions
        .addIntegerOption(o =>
            o.setName('messagecount')
                .setDescription('The amount of messages you want to clear.')
                .setRequired(true))
        .addBooleanOption(o =>
            o.setName('avoidpinned')
                .setDescription('If true, avoids pinned messages.'))
        .addUserOption(o =>
            o.setName('user')
                .setDescription('Limits the purge to a single user.')),
    async execute(interaction) {
        // collects the message count from the original command
        // knowing the message count allows you know how many messages should be cleared
        const messagecount = interaction.options.getInteger('messagecount');
        const avoidPinned = interaction.options.getBoolean('avoidpinned');
        const target = interaction.options.getUser('user');

        // fetch all messages in a server
        // uses discord snowflakes to gather the messages
        const date = new Date(); date.setDate(date.getDate() - 14);
        const fd = new Snowflake(date), fd2 = fd.generate();
        let msgs = await interaction.channel.messages.fetch({ after: fd, limit: messagecount });

        // if a target is specified, apply a filter to messages to remove all other messages
        // grabs messages from most recent up, grabbing only the specified amount
        if (target) { msgs = msgs.filter(msg => msg.author.id === target.id); }

        // if the user chooses to avoid pinned messages, filter pinned messages out of the list
        if (avoidPinned == true) { msgs = msgs.filter(msg => msg.pinned !== true); }

        // console.log(messages.first(messagecount));

        console.log(msgs);

        // delete all messages based on prior filters applied
        await interaction.channel.bulkDelete(msgs.first(messagecount));

        // reply to the message
        interaction.reply(`Attempted to clear ${messagecount} messages. This only works within 14 days, so any prior remain untouch.`).then(msg => { setTimeout(() => msg.delete(), 5000); });
    },
};