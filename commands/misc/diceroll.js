const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Allows you to roll the dice!')
		.addIntegerOption(option =>
			option.setName('number')
				.setDescription('The size of the die that you want to roll.')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The amount of dice you want to roll.')),
	async execute(interaction) {
		// sets up all necessary constants for the embed
		const iUser = interaction.user;
		const nickname = iUser.nickname ?? iUser.displayName;
		const avatar = iUser.displayAvatarURL();
		const inputNum = interaction.options.getInteger('number');
		const amountNum = interaction.options.getInteger('amount') ?? 1;
		const successes = ['Success!', 'Rolled the dice.', 'Pray for success...', 'Last chance to beat the dragon...', 'WOAH!'];
		const errors = ['You\'re crazy!', 'Critical failure?', 'Oops!', 'The DM denied this.', 'What are you trying?'];
		const sTitle = successes[Math.floor(Math.random() * successes.length)];
		const eTitle = errors[Math.floor(Math.random() * errors.length)];
		let rollSum = 0;
		let rollNum = 0;
		const rollEmbed = new EmbedBuilder()
			.setAuthor({ name: nickname, iconURL: avatar })
			.setTimestamp(+new Date());

		if (amountNum > 1) {
			if (inputNum <= 0) {
				rollEmbed.setTitle(eTitle).setDescription('Cannot roll a die that is less than 1!').setColor('Red');
				interaction.reply({ embeds: [rollEmbed] });
			}
			else {
				const outputs = [];
				for (let i = 0; i < amountNum; i++) {
					rollNum = Math.floor(Math.random() * inputNum + 1);
					outputs.push(rollNum);
					rollSum += rollNum;
				}
				if (outputs.length >= 10) {
					outputs.length = 10;
				}
				const fOutput = outputs.join(', ', 10);

				if (rollSum <= 1) {
					rollEmbed.setTitle('Critical failure!');
				}
				else {
					rollEmbed.setTitle(sTitle);
				}


				rollEmbed.setTitle(sTitle).setDescription(`You rolled ${amountNum} D${inputNum}, and received a roll of ${rollSum}. \nSome of the outputs include: ${fOutput}`).setColor('Green');
				interaction.reply({ embeds: [rollEmbed] });
			}
		}
		else if (amountNum <= 0) {
			rollEmbed.setTitle(eTitle).setDescription('Cannot roll less than one die!').setColor('Red');
			interaction.reply({ embeds: [rollEmbed] });
		}
		else {
			rollNum = Math.floor(Math.random() * inputNum + 1);

			if (rollNum <= 1) {
				rollEmbed.setTitle('Critical failure!');
			}
			else if (rollNum == inputNum - 1) {
				rollEmbed.setTitle('Critical success!');
			}
			else {
				rollEmbed.setTitle(sTitle);
			}

			rollEmbed.setDescription(`You rolled a D${inputNum}, and received a roll of ${rollNum}.`).setColor('Green');
			interaction.reply({ embeds: [rollEmbed] });
		}

	},
};