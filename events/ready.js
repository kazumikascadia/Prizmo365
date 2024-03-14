// derived from https://discordjs.guide/

const { Events, ActivityType } = require('discord.js');
const { version } = require('../config.json');
const chalk = require('chalk');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		// set all of the activities that can appear; then, select one randomly from the length
		const activities = ['Subway Surfers', 'with your heart', 'with legos!', 'by myself :(', 'with my friends!', 'with my dad :)', 'with my mom :)', 'at the playground!', 'on the swings!', 'in VR!', 'BetaQuest', 'my PS4'];
		const act = activities[Math.floor(Math.random() * activities.length)];
		// set the activity of the client user, showing both the previously selected activity and setting it to a desired message (for Prizmo, playing)
		client.user.setActivity(`${act} | ${version}`, { type: ActivityType.Playing });
		// sets a refreshing interval for every hour
		setInterval(activity => { client.user.setActivity(`${act} | ${version}`, { type: ActivityType.Playing }); }, 3600000);
		// log that the bot is going online, with the stated activity and version
		console.log(chalk.blueBright('[ONLINE]'), `Logged in as ${client.user.tag}, Version ${version}. Today I'm playing ${act}`);
	},
};