const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Play rock, paper, scissors with Prizmo!')
		.addStringOption(option =>
			option.setName('move')
				.setDescription('The specific move you want to make.')
				.setRequired(true)
				.addChoices(
					{ name: 'rock', value: 'rock' },
					{ name: 'paper', value: 'paper' },
					{ name: 'scissors', value: 'scissors' },
				)),
	async execute(interaction) {
		const iUser = interaction.user;
		const nickname = iUser.nickname ?? iUser.displayName;
		const avatar = iUser.displayAvatarURL();
		const move = interaction.options.getString('move');
		const responses = ['rock', 'paper', 'scissors'];
		const response = responses[Math.floor(Math.random() * responses.length)];
		const rpsEmbed = new EmbedBuilder()
			.setTitle('A classic game of rock, paper, scissors!')
			.setAuthor({ name: nickname, iconURL: avatar })
			.setTimestamp(+new Date());

		if (!responses.includes(move)) {
			rpsEmbed.setTitle('Error.').setDescription(`You chose **${move}**, but I don't know how to play against that!`).setColor('Red');
			await interaction.reply({ embeds: [rpsEmbed] });
		}
		else if (response == move) {
			rpsEmbed.setTitle('It\'s a tie!').setDescription(`We both chose ${move}! That's so funny.`).setColor('Blue');
			await interaction.reply({ embeds: [rpsEmbed] });
		}
		else {
			if (move == 'rock') {
				if (response == 'paper') {
					rpsEmbed.setColor('Red').setDescription(`I chose **${response}**, you chose **${move}**.\nI win!`);
					await interaction.reply({ embeds: [rpsEmbed] });
				}
				else {
					rpsEmbed.setColor('Green').setDescription(`I chose **${response}**, you chose **${move}**.\nYou win!`);
					await interaction.reply({ embeds: [rpsEmbed] });
				}
			}

			if (move == 'paper') {
				if (response == 'scissors') {
					rpsEmbed.setColor('Red').setDescription(`I chose **${response}**, you chose **${move}**.\nI win!`);
					await interaction.reply({ embeds: [rpsEmbed] });
				}
				else {
					rpsEmbed.setColor('Green').setDescription(`I chose **${response}**, you chose **${move}**.\nYou win!`);
					await interaction.reply({ embeds: [rpsEmbed] });
				}
			}

			if (move == 'scissors') {
				if (response == 'rock') {
					rpsEmbed.setColor('Red').setDescription(`I chose **${response}**, you chose **${move}**.\nI win!`);
					await interaction.reply({ embeds: [rpsEmbed] });
				}
				else {
					rpsEmbed.setColor('Green').setDescription(`I chose **${response}**, you chose **${move}**.\nYou win!`);
					await interaction.reply({ embeds: [rpsEmbed] });
				}
			}
		}
	},
};