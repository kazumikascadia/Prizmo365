const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { unit, round } = require('mathjs');

function generateValidEmbed(interaction, amt, unit1, newAmt, unit2) {
    const iUser = interaction.user;
    const nickname = iUser.nickname ?? iUser.displayName;
    const avatar = iUser.displayAvatarURL();

    const convertEmbed = new EmbedBuilder()
        .setTitle('Unit Conversions')
        .setAuthor({ name: nickname, iconURL: avatar })
        .setDescription(`Converted ${amt} ${unit1} to ${newAmt.toString()} ${unit2}.`)
        .setColor('Blue')
        .setTimestamp(+new Date());

    interaction.reply({ embeds: [convertEmbed] });
}

function generateInvalidEmbed(interaction) {
    const iUser = interaction.user;
    const nickname = iUser.nickname ?? iUser.displayName;
    const avatar = iUser.displayAvatarURL();

    const convertEmbed = new EmbedBuilder()
        .setTitle('Unit Conversions')
        .setAuthor({ name: nickname, iconURL: avatar })
        .setDescription('You can\'t convert two of the same unit!')
        .setColor('Red')
        .setTimestamp(+new Date());

    interaction.reply({ embeds: [convertEmbed] });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convert')
        .setDescription('Allows the user to convert from one unit to another.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('measures')
                .setDescription('Used for length/width/height.')
                .addNumberOption(option =>
                    option
                        .setName('amount')
                        .setRequired(true)
                        .setDescription('The amount of the unit you want to use.'),
                )
                .addStringOption(option =>
                    option.setName('unit1')
                        .setRequired(true)
                        .setDescription('The first unit you want to use.')
                        .addChoices(
                            { name: 'picometers', value: 'pm' },
                            { name: 'nanometers', value: 'nm' },
                            { name: 'micrometers', value: 'um' },
                            { name: 'millimeters', value: 'mm' },
                            { name: 'centimeters', value: 'cm' },
                            { name: 'decimeters', value: 'dm' },
                            { name: 'meters', value: 'm' },
                            { name: 'decameters', value: 'dam' },
                            { name: 'hectometers', value: 'hm' },
                            { name: 'kilometers', value: 'km' },
                            { name: 'megameters', value: 'Mm' },
                            { name: 'gigameters', value: 'Gm' },
                            // imperial measures
                            { name: 'inches', value: 'in' },
                            { name: 'feet', value: 'ft' },
                            { name: 'yards', value: 'yd' },
                            { name: 'miles', value: 'mi' },
                        ),
                )
                .addStringOption(option =>
                    option
                        .setName('unit2')
                        .setRequired(true)
                        .setDescription('The second unit you want to use.')
                        .addChoices(
                            { name: 'picometers', value: 'pm' },
                            { name: 'nanometers', value: 'nm' },
                            { name: 'micrometers', value: 'um' },
                            { name: 'millimeters', value: 'mm' },
                            { name: 'centimeters', value: 'cm' },
                            { name: 'decimeters', value: 'dm' },
                            { name: 'meters', value: 'm' },
                            { name: 'decameters', value: 'dam' },
                            { name: 'hectometers', value: 'hm' },
                            { name: 'kilometers', value: 'km' },
                            { name: 'megameters', value: 'Mm' },
                            { name: 'gigameters', value: 'Gm' },
                            // imperial measures
                            { name: 'inches', value: 'in' },
                            { name: 'feet', value: 'ft' },
                            { name: 'yards', value: 'yd' },
                            { name: 'miles', value: 'mi' },
                        ),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('surfacearea')
                .setDescription('Used for any type of area.')
                .addNumberOption(option =>
                    option
                        .setName('amount')
                        .setRequired(true)
                        .setDescription('The amount of the unit you want to use.'),
                )
                .addStringOption(option =>
                    option
                        .setName('unit1')
                        .setRequired(true)
                        .setDescription('The first unit you want to use.')
                        .addChoices(
                            // surface area
                            { name: 'square inches', value: 'sqin' },
                            { name: 'square feet', value: 'sqft' },
                            { name: 'square yards', value: 'sqyd' },
                            { name: 'square miles', value: 'sqmi' },
                            { name: 'acres', value: 'acre' },
                            { name: 'hectares', value: 'hectare' },
                        ),
                )
                .addStringOption(option =>
                    option
                        .setName('unit2')
                        .setRequired(true)
                        .setDescription('The second unit you want to use.')
                        .addChoices(
                            // surface area
                            { name: 'square inches', value: 'sqin' },
                            { name: 'square feet', value: 'sqft' },
                            { name: 'square yards', value: 'sqyd' },
                            { name: 'square miles', value: 'sqmi' },
                            { name: 'acres', value: 'acre' },
                            { name: 'hectares', value: 'hectare' },
                        ),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('volume')
                .setDescription('Used for volumetric measurements')
                .addNumberOption(option =>
                    option
                        .setName('amount')
                        .setRequired(true)
                        .setDescription('The amount of the unit you want to use.'),
                )
                .addStringOption(option =>
                    option
                        .setName('unit1')
                        .setRequired(true)
                        .setDescription('The first unit you want to use.')
                        .addChoices(
                            // volume (liters)
                            { name: 'picoliters', value: 'pL' },
                            { name: 'nanoliters', value: 'nL' },
                            { name: 'microliters', value: 'uL' },
                            { name: 'milliliters', value: 'mL' },
                            { name: 'centiliters', value: 'cL' },
                            { name: 'deciliters', value: 'dL' },
                            { name: 'liters', value: 'L' },
                            { name: 'decaliters', value: 'daL' },
                            { name: 'hectoliters', value: 'hL' },
                            { name: 'kiloliters', value: 'kL' },
                            { name: 'megaliters', value: 'ML' },
                            { name: 'gigaliters', value: 'GL' },
                            // volume (imperial)
                            { name: 'fluid ounces', value: 'floz' },
                            { name: 'cups', value: 'cp' },
                            { name: 'pints', value: 'pt' },
                            { name: 'quarts', value: 'qt' },
                            { name: 'gallons', value: 'gal' },
                        ),
                )
                .addStringOption(option =>
                    option
                        .setName('unit2')
                        .setRequired(true)
                        .setDescription('The second unit you want to use.')
                        .addChoices(
                            // volume (liters)
                            { name: 'picoliters', value: 'pL' },
                            { name: 'nanoliters', value: 'nL' },
                            { name: 'microliters', value: 'uL' },
                            { name: 'milliliters', value: 'mL' },
                            { name: 'centiliters', value: 'cL' },
                            { name: 'deciliters', value: 'dL' },
                            { name: 'liters', value: 'L' },
                            { name: 'decaliters', value: 'daL' },
                            { name: 'hectoliters', value: 'hL' },
                            { name: 'kiloliters', value: 'kL' },
                            { name: 'megaliters', value: 'ML' },
                            { name: 'gigaliters', value: 'GL' },
                            // volume (imperial)
                            { name: 'fluid ounces', value: 'floz' },
                            { name: 'cups', value: 'cp' },
                            { name: 'pints', value: 'pt' },
                            { name: 'quarts', value: 'qt' },
                            { name: 'gallons', value: 'gal' },
                        ),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('time')
                .setDescription('Used for any type of time.')
                .addNumberOption(option =>
                    option
                        .setName('amount')
                        .setRequired(true)
                        .setDescription('The amount of the unit you want to use.'),
                )
                .addStringOption(option =>
                    option
                        .setName('unit1')
                        .setRequired(true)
                        .setDescription('The first unit you want to use.')
                        .addChoices(
                            // time
                            { name: 'seconds', value: 'sec' },
                            { name: 'minutes', value: 'min' },
                            { name: 'hours', value: 'hrs' },
                            { name: 'days', value: 'days' },
                            { name: 'weeks', value: 'weeks' },
                            { name: 'months', value: 'months' },
                            { name: 'years', value: 'years' },
                            { name: 'decades', value: 'decades' },
                            { name: 'centuries', value: 'centuries' },
                            { name: 'millennia', value: 'millennia' },
                        ),
                )
                .addStringOption(option =>
                    option
                        .setName('unit2')
                        .setRequired(true)
                        .setDescription('The second unit you want to use.')
                        .addChoices(
                            // time
                            { name: 'seconds', value: 'sec' },
                            { name: 'minutes', value: 'min' },
                            { name: 'hours', value: 'hrs' },
                            { name: 'days', value: 'days' },
                            { name: 'weeks', value: 'weeks' },
                            { name: 'months', value: 'months' },
                            { name: 'years', value: 'years' },
                            { name: 'decades', value: 'decades' },
                            { name: 'centuries', value: 'centuries' },
                            { name: 'millennia', value: 'millennia' },
                        ),
                ),
        ),
    async execute(interaction) {
        // grab all inputs
        const amt = interaction.options.getNumber('amount');
        const unit1 = interaction.options.getString('unit1');
        const unit2 = interaction.options.getString('unit2');
        const newAmt = unit(amt, unit1).to(unit2).toNumber();

        if (unit1 == unit2) {
            generateInvalidEmbed(interaction);
        }
        else {
            generateValidEmbed(interaction, amt, unit1, unit2, newAmt);
        }
    },
};