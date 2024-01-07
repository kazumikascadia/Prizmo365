const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// We create the list of allowed characters. These are only
// in uppercase which means that characters must be converted to uppercase.
const allowedCharacters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];

// Accepts the input from an interaction and returns a sorted
// and filtered output.
function filterInput(input) {
    return input
        .toUpperCase()
        .split("")
        .sort()
        .filter((c) => {
            return allowedCharacters.includes(c);
        });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("alphabet")
        .setDescription("Tells the amount of letters in an alphabet.")
        .addStringOption((option) =>
            option
                .setName("input")
                .setDescription("The word/sentence you want to put in.")
                .setRequired(true)
                .setMaxLength(1000)
        ),
    async execute(interaction) {
        // sets up all necessary constants for the embed
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();

        // set up the embed with starting variables
        const aEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());

        // Gather and filter the input.
        const input = interaction.options.getString('input');
        const filteredInput = filterInput(input);

        // check if the output is actually greater than one; if it isn't, it means that there will be no output, which cannot be accepted
        // if the output is greater than one, continue as normal
        if (filteredInput.length > 1) {
            // turns the length of the output array into a constant
            const letters = filteredInput.length;
            // formats the list into a proper sentence
            const fOutput = new Intl.ListFormat("en", {
                style: "long",
                type: "conjunction",
            });
            const fOutput2 = fOutput.format(filteredInput);
            // creates the final embed
            aEmbed
                .setTitle("Your word, split apart.")
                .setDescription(
                    `Your word or sentence,\n> ${input}\ncontains the following letters: \n> ${fOutput2}. \nOverall, it contains ${letters}/26 letters.`
                )
                .setColor("Green");

            // replies to the interaction with the embed
            interaction.reply({ embeds: [aEmbed] });
        }
        // in all other cases, send an error
        else {
            // creates the final embed, telling the user what is wrong
            aEmbed
                .setTitle("Error")
                .setDescription(
                    "Because you put no actual letters into your statement, none can be counted."
                )
                .setColor("Red");

            // sends the message
            interaction.reply({ embeds: [aEmbed] });
        }
    },
};
