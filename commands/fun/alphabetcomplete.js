const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('alphabet')
		.setDescription('Tells the amount of letters in an alphabet.')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The word/sentence you want to put in.')
				.setRequired(true)
				.setMaxLength(1000)),
	async execute(interaction) {
		// sets up all necessary constants for the embed
		const iUser = interaction.user;
		const nickname = iUser.nickname ?? iUser.displayName;
		const avatar = iUser.displayAvatarURL();
		// gathers input to be used
		const input = interaction.options.getString('input');
		// creates an array using the input
		const array = input.toUpperCase().split('');
		// creates the real letters array
		const realLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		// creates a usable array for the undesirable characters and a second for the output
		const undesirables = [];
		const output = [];

		// sorts the array
		array.sort();

		// removes undesirable characters from the array
		array.forEach(element => {
			if (!realLetters.includes(element)) {
				undesirables.push(element);
			}
		});
		// pushes unused characters into an output array
		array.forEach(element => {
			if (!output.includes(element) && !undesirables.includes(element)) {
				output.push(element);
			}
			else {
				return;
			}
		});

		// turns the length of the output array into a constant
		const letters = output.length;
		// formats the list into a proper sentence
		const fOutput = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
		const fOutput2 = fOutput.format(output);
		// creates the final embed
		const aEmbed = new EmbedBuilder()
			.setTitle('Your word, split apart.')
			.setDescription(`Your word or sentence,\n> ${input}\ncontains the following letters: \n> ${fOutput2}. \nOverall, it contains ${letters}/26 letters.`)
			.setColor('Green')
			.setAuthor({ name: nickname, iconURL: avatar })
			.setTimestamp(+new Date());

		// replies to the interaction with the embed
		interaction.reply({ embeds: [aEmbed] });
	},
};