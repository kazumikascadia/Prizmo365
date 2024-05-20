const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purges a collection of messages. Requires Manage Guild Permissions.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild) // sets the command to require manage guild permissions
        .addIntegerOption(o =>
            o.setName('messagecount')
                .setDescription('The amount of messages you want to clear.')
                .setRequired(true)),

    async execute(interaction) {
        // collects the message count from the original command
        // knowing the message count allows you know how many messages should be cleared
        const messagecount = interaction.options.getInteger('messagecount');

        await interaction.channel.messages.fetch({ limit: messagecount })
            .then(messages => interaction.channel.bulkDelete(messages));

        interaction.reply(`Cleared ${messagecount} messages.`).then(msg => { setTimeout(() => msg.delete(), 10000); });
    },
};