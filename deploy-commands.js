// derived from https://discordjs.guide/

const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');

module.exports = {
	deploy: function() {
		const commands = [];
		// grab all the command files from the commands directory you created earlier
		const foldersPath = path.join(__dirname, 'commands');
		const commandFolders = fs.readdirSync(foldersPath);

		for (const folder of commandFolders) {
			// grab all of the command files from the commands directory
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

			// grab the SlashCommandBuilder#toJSON() output of each commands data for deployment
			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const command = require(filePath);
				if ('data' in command && 'execute' in command) {
					commands.push(command.data.toJSON());
				}
				else {
					console.log(chalk.redBright('[WARNING]'), `The command at ${filePath} is missing a required "data" or "execute" property.`);
				}
			}
		}

		// construct and prepare an instance of the REST module
		const rest = new REST().setToken(token);
		(async () => {
			try {
				console.log(chalk.yellowBright('[STARTING]'), `Started refreshing ${commands.length} application (/) commands.`);

				// the put method is used to fully refresh all commands in the guild with the current set
				const data = await rest.put(
					Routes.applicationCommands(clientId),
					// Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);

				console.log(chalk.greenBright('[SUCCESS]'), `Successfully reloaded ${data.length} application (/) commands.`);
			}
			catch (error) {
				// log any possible errors
				console.error(error);
			}
		})();
	},
};

