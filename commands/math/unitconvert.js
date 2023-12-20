const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { unit, round } = require('mathjs');

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
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const amt = interaction.options.getNumber('amount');

        // set unit1 and unit2 to input
        const unit1 = interaction.options.getString('unit1');
        const unit2 = interaction.options.getString('unit2');

        const convertEmbed = new EmbedBuilder()
            .setTitle('Unit Conversions')
            .setAuthor({ name: nickname, iconURL: avatar })
            .setColor('Blue')
            .setTimestamp(+new Date());

        const newAmt = unit(amt, unit1).to(unit2).toNumber();
        console.log(newAmt);

        if (unit1 == unit2) {
            convertEmbed.setDescription('You can\'t convert two of the same unit!').setColor('Red');
        }
        else if (newAmt < 0) {
            const newAmt2 = round(newAmt, 5).toString();
            convertEmbed.setDescription(`Converted ${amt} ${unit1} to ${newAmt2} ${unit2} (rounded).`);
            console.log(newAmt2);
        }
        else {
            convertEmbed.setDescription(`Converted ${amt} ${unit1} to ${newAmt.toString()} ${unit2} (rounded).`);
            console.log(newAmt);
        }

        interaction.reply({ embeds: [convertEmbed] });
    },
};