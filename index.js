// derived from https://discordjs.guide/

// Require the necessary djs classes
const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');
const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, clientId, version } = require('./config.json');
const { data } = require('./commands/utility/set');

// Create a new client instance
const client = new Client({
	intents:
		[
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
		],
});

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

client.on('messageCreate', async message => {
	if (message.author.bot) return false;
	const iUser = message.author;
	const nickname = iUser.nickname ?? iUser.displayName;
	const avatar = iUser.displayAvatarURL();
	const repEmbed = new EmbedBuilder()
		.setAuthor({ name: nickname, iconURL: avatar })
		.setTimestamp(+new Date())
		.setTitle('Prizmo365')
		.setDescription('Hello! I\'m Prizmo, your friendly neighborhood assisant!')
		.setColor('#17ac86');
	if (message.mentions.has(clientId)) {
		message.reply({ embeds: [repEmbed] });
	}

	if (message.author.id == '306372629650997260' && message.content == 'r') {
		console.log('Forced restart.');
		await message.reply('Restarting...');
		process.exit();
	}
});