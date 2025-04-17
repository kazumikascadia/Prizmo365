// derived from https://discordjs.guide/
const { Events } = require('discord.js');
const { returnError } = require ('./returnerror.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		// if (!interaction.isChatInputCommand() || !interaction.isUserContextMenuCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			returnError(interaction, `No command matching ${interaction.commandName} was found.`);
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.log(`Error executing ${interaction.commandName}.`);
			console.log(error);
			returnError(interaction, `Something failed behind the scenes when executing ${interaction.commandName}.`);
		}
	},
};