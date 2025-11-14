const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Rolls the magic 8 ball.')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('The question you want to ask.')
				.setRequired(true)
				.setMaxLength(1000)),
	async execute(interaction) {
		// sets up all necessary constants for the embed
		const iUser = interaction.user;
		const nickname = iUser.nickname ?? iUser.displayName;
		const avatar = iUser.displayAvatarURL();
		// gets the question from the input
		const question = interaction.options.getString('question');
		// sets up the answers, then chooses a random one
		const answers = ['Yes.', 'No.', 'Maybe.', 'Without a doubt.', 'As I see it, yes.', 'Signs point to yes.', 'Very doubtful.', 'Outlook not so good.', 'Concentrate and ask again.', 'Cannot predict now.', 'Ask again later.', 'It is certain.', 'Most likely.', 'I cannot say for sure.'];
		const answer = await answers[Math.floor(Math.random() * answers.length)];
		// sets up the embed
		const eightBallEmbed = new EmbedBuilder()
			.setTitle(question)
			.setColor('Blue')
			.setDescription(answer)
			.setAuthor({ name: nickname, iconURL: avatar })
			.setTimestamp(+new Date());

		// replies with the embed
		interaction.reply({ embeds: [eightBallEmbed] });
	},
};