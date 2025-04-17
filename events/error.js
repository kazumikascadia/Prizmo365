const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    returnError: function(interaction, error) {
        const failedEmbed = new EmbedBuilder().setColor('Red')
        .setDescription(`An error was encountered while attempting to execute /${interaction.commandName}:\n**${error}**`);
        interaction.reply({ embeds: [failedEmbed], ephemeral: true });

        console.log(chalk.redBright('[ERROR]'), `A user encountered an error while attempting to execute ${interaction.commandName}: ${error}`);
    },
};