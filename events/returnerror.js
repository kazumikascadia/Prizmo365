const { EmbedBuilder } = require('discord.js');

module.exports = {
    returnError: function(interaction, error) {
        const failedEmbed = new EmbedBuilder().setTitle('Error!').setColor('Red').setTimestamp(+new Date()).setDescription(`${error}`);
        console.log(`A user encountered an error for reason:\n> ${error}`);
        return interaction.reply({ embeds: [failedEmbed], ephemeral: true });
    },
};