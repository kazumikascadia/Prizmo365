const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// We create the list of allowed characters. These are only
// in uppercase which means that characters must be converted to uppercase.
const allowedCharacters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];

// Accepts the input from an interaction and returns a sorted
// and filtered output.
function filterInput(input) {
    return input
        .toUpperCase()
        .split('')
        .sort()
        .filter((c) => {
            return allowedCharacters.includes(c);
        })
        .toString();
}

function generateStandardEmbed(interaction, originalInput,
    formattedFilteredInput, letterCount) {
    const user = interaction.user;
    const nickname = user.nickname ?? user.displayName;
    const avatar = user.displayAvatarURL();

    return new EmbedBuilder()
        .setAuthor({ name: nickname, iconURL: avatar })
        .setTimestamp(+new Date())
        .setTitle('Your word, split apart.')
        .setDescription(
            `Your word or sentence,\n> ${originalInput}\ncontains the following letters: \n> ${formattedFilteredInput}. \nOverall, it contains ${letterCount}/26 letters.`,
        )
        .setColor('Green');
}

function generateErrorEmbed(interaction) {
    const user = interaction.user;
    const nickname = user.nickname ?? user.displayName;
    const avatar = user.displayAvatarURL();

    return new EmbedBuilder()
        .setAuthor({ name: nickname, iconURL: avatar })
        .setTimestamp(+new Date())
        .setTitle('Error')
        .setDescription(
            'Because you put no actual letters into your statement, none can be counted.',
        )
        .setColor('Red');
}

function respondToValidInput(interaction, originalInput, filteredInput) {
    const letterCount = filteredInput.length;

    // Formats the list into a proper sentence
    const formatter = new Intl.ListFormat('en', {
        style: 'long',
        type: 'conjunction',
    });

    const formattedFilteredInput = formatter.format(filteredInput.split(''));

    // Replies to the interaction with the embed
    interaction.reply({ embeds: [generateStandardEmbed(interaction, originalInput,
        formattedFilteredInput, letterCount)] });
}

function respondToInvalidInput(interaction) {
    interaction.reply({ embeds: [generateErrorEmbed(interaction)] });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alphabet')
        .setDescription('Tells the amount of letters in an alphabet.')
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('The word/sentence you want to put in.')
                .setRequired(true)
                .setMaxLength(1000),
        ),
    async execute(interaction) {
        // Gather and filter the input.
        const input = interaction.options.getString('input');
        const filteredInput = filterInput(input);

        // If the filtered input is not greater than 1, it means that there will be no output, which
        // cannot be accepted. if the filtered input is greater than one, continue as normal
        if (filteredInput.length > 1) {
            respondToValidInput(interaction, input, filteredInput);
        }
        else {
            respondToInvalidInput(interaction);
        }
    },
};
