// derived from https://discordjs.guide/

const { Events, ActivityType } = require('discord.js');
const { version } = require('../config.json');
const chalk = require('chalk');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		const activities = ['Subway Surfers', 'with your heart', 'with legos!', 'by myself :(', 'with my friends!', 'with my dad :)', 'with my mom :)', 'at the playground!', 'on the swings!', 'in VR!', 'BetaQuest', 'my PS4'];
		const activity = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(`${activity} | ${version}`, { type: ActivityType.Playing });
		console.log(chalk.blueBright('[ONLINE]'), `Logged in as ${client.user.tag}, Version ${version}. Today I'm playing ${activity}`);
	},
};