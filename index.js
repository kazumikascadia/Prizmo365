// derived from https://discordjs.guide/

// Require the necessary djs classes
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');
const { Client, Collection, GatewayIntentBits, Partials, Events } = require('discord.js');
const { token, clientId, version } = require('./config.json'), deployment = require('./deploy-commands');

// Create a new client instance
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
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
	],
});

deployment.deploy();

console.log(chalk.yellowBright('[STARTING]'), 'Loading commands...');

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(chalk.greenBright('[SUCCESS]'), `Loaded ./commands/${folder}/${file}`);
		}
		else {
			console.log(chalk.yellow('[WARNING]'), `The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
	console.log(chalk.cyanBright('[LOADED]'), 'Commands loaded!');
}

console.log(chalk.yellowBright('[STARTING]'), 'Loading events...');

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
		console.log(chalk.greenBright('[SUCCESS]'), `Loaded ./events/${file}`);
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
		console.log(chalk.greenBright('[SUCCESS]'), `Loaded ./events/${file}`);
	}
}
console.log(chalk.cyanBright('[LOADED]'), 'Events loaded!');

// const pkgFile = './package.json';
// let pData = JSON.parse(fs.readFileSync(pkgFile));
// pData['version'] = `${version}`;
// fs.writeFileSync(pkgFile, JSON.stringify(pData, null, 4));

// Log into Discord with your client's token
client.login(token);

