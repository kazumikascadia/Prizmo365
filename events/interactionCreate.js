// derived from https://discordjs.guide/

const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const iUser = interaction.user;
		const nickname = iUser.nickname ?? iUser.displayName;
		const avatar = iUser.displayAvatarURL();
		const failedEmbed = new EmbedBuilder()
			.setTitle('Error!')
			.setColor('Red')
			.setAuthor({ name: nickname, iconURL: avatar })
			.setTimestamp(+new Date());

		// if (!interaction.isChatInputCommand() || !interaction.isUserContextMenuCommand()) return;

		if (interaction.isUserContextMenuCommand()) { console.log('context menu!'); }

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			failedEmbed.setDescription('That command does not exist.');
			interaction.reply({ embeds: [failedEmbed], ephemeral: true });
			return;
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(`Error executing ${interaction.commandName}.`);
			console.error(error);
			failedEmbed.setDescription('Cannot execute that command at this moment.');
			interaction.reply({ embeds: [failedEmbed], ephemeral: true });
		}
	},
};