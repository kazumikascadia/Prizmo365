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
        // uses 
        const date = new Date(); date.setDate(date.getDate() - 14);
        const fd = new Snowflake(date), fd2 = fd.generate();
        const messages = await interaction.channel.messages.fetch({ after: fd });

        // if a target is specified, apply a filter to messages to remove all other messages
        // grabs messages from most recent up, grabbing only the specified amount
        if (target) { messages.filter(msg => msg.author.id === target.id); }

        // if the user chooses to avoid pinned messages, filter pinned messages out of the list
        console.log(avoidPinned);
        if (avoidPinned == true) { messages.filter(msg => msg.pinnned !== true); }

        // if (!target, avoidPinned == false) { messages = await interaction.channel.messages.fetch({ limit: messagecount }); }

        console.log(messages.first(messagecount));
        // delete all messages based on prior filters applied
        // await interaction.channel.bulkDelete(messages.first(messagecount));
        // reply to the message
        interaction.reply(`Attempted to clear ${messagecount} messages. This only works within 14 days, so any prior remain untouch.`).then(msg => { setTimeout(() => msg.delete(), 5000); });
    },
};