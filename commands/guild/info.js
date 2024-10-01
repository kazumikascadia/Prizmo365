const { ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const moment = require('moment'), fs = require('fs');
const { token, link } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides info on the chosen object.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Provides info on a specific user.')
                .addUserOption(option => option.setName('target').setRequired(true).setDescription('A specified user.')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Provides info on the overall server.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Provides info on the bot.')),
    async execute(interaction) {
        // create a new client variable to be used in this command, specifically using certain intents to fetch guild members and presences
        const client = new Client({
            intents:
                [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildPresences,
                    GatewayIntentBits.GuildMembers,
                ],
        });

        // fetch the information of the user who used this command, as well as the guild they are in
        const iUser = interaction.user;
        const nickname = iUser.nickname ?? iUser.displayName;
        const avatar = iUser.displayAvatarURL();
        const server = interaction.guild;

        // grab the used subcommand and set up the embed with just two info variables
        const subcommand = interaction.options.getSubcommand();
        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());
        // login again and grab all guilds, then fetching their memberbase
        // this keeps the info commands up to date, so that they will always display CURRENT information
        await client.login(token).then(client.guilds.fetch()).then(server.fetch()).then(server.members.fetch());

        // checks if the subcommand is the user subcommand
        if (subcommand === 'user') {
            // fetches user information on the desired target; if no target, use the interaction user
            // since this command requires a target, it will always have a selected target (subject to change)
            // this section grabs the targets id, avatar, their place in the current guild, their accent hex color, and their guild roles
            const mUser = await interaction.options.getUser('target').fetch(true) || iUser.fetch(true);
            const uid = mUser.id;
            const mavatar = mUser.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }) ?? mUser.defaultAvatarURL({ dynamic: true, size: 960, format: 'png' });
            const gUser = server.members.cache.get(uid);
            const accentColor = mUser.hexAccentColor;
            // find all of the roles of the selected user, then map and join them together in a string (all excluding @everyone)
            let roles = gUser.roles.cache.filter(r => r.name !== '@everyone').map(r => `${r}`).join(', ');
            // create a new variable just for the length of the roles string
            let rLength = roles.split(', ').length;
            // create a dictionary for all user flags (items that appear on the user as badges)
            const flags = {
                ActiveDeveloper: 'Active Developer',
                BugHunterLevel1: 'Bug Hunter Level 1',
                BugHunterLevel2: 'Bug Hunter Level 2',
                CertifiedModerator: 'Certified Moderator Alumni',
                HypeSquadOnlineHouse1: 'House Bravery Member',
                HypeSquadOnlineHouse2: 'House Brilliance Member',
                HypeSquadOnlineHouse3: 'House Balance Member',
                HypeSquad: 'HypeSquad Events Member',
                Parnter: 'Partnered Server Owner',
                PremiumEarlySupporter: 'Early Nitro Supporter',
                Staff: 'Discord Employee',
                VerifiedBot: 'Verified Bot',
                VerifiedDeveloper: 'Verified Bot Developer',
            };
            // create an array of all the user's flags
            const uFlags = mUser.flags.toArray();
            // create a dictionary for all user presences; specifically, this will differentiate if the user is offline or just hidden
            const statuses = {
                online: 'Online',
                idle: 'Idle',
                dnd: 'Do Not Disturb',
                offline: 'Invisible',
                off: 'Offline',
            };
            // create a variable for the title of the embed
            let title;
            // if the user is NOT a bot, set the title to just be their username
            if (!mUser.bot) {
                title = mUser.username;
            }
            // if the user is a bot, add a bot tag to the title
            else {
                title = mUser.username + ' [BOT]';
            }

            // check if the user has roles; if not, set their roles to say just 'No roles', and set rlength to 0
            if (`${roles}` == '') {
                roles = 'No roles';
                rLength = '0';
            }

            // using the info embed from earlier, set the title, description, and create several fields to show information on the user
            infoEmbed
                .setTitle(title)
                .setDescription(`Known as ${mUser}; currently set to ${statuses[gUser.presence ? gUser.presence.status : 'off']}`)
                .addFields(
                    { name: `Roles [${rLength}]:`, value: roles ?? 'No roles' },
                    { name: 'Flags:', value: `${uFlags.length ? uFlags.map(flag => flags[flag]).join(', ') : 'None'}` },
                    { name: 'Joined Discord:', value: `${moment.utc(mUser.createdAt).format('MMM Do, YYYY hh:mm A')} UTC (${moment.utc(mUser.createdAt).fromNow()})`, inline: true },
                    { name: 'Joined Server:', value: `${moment.utc(gUser.joinedAt).format('MMM Do, YYYY hh:mm A')} UTC (${moment.utc(gUser.joinedAt).fromNow()})`, inline: true },
                )
                .setColor(accentColor)
                .setThumbnail(mavatar)
                .setFooter({ text: `ID: ${uid}` });

            // finally, send the embed in a message
            interaction.reply({ embeds: [infoEmbed] });

        }

        if (subcommand === 'server') {
            // fetched server information
            const serverIcon = server.iconURL({ dynamic: true, size: 1024, format: 'png' }) ?? iUser.defaultAvatarURL;
            const serverName = server.name;
            const voiceChannelAmount = server.channels.cache.filter(c => c.type === 2).size;
            const textChannelAmount = server.channels.cache.filter(c => c.type === 0).size;
            const humanCount = server.members.cache.filter(m => !m.user.bot).size;
            const botCount = server.members.cache.filter(m => m.user.bot).size;
            const roles = server.roles.cache.filter(r => r.name !== '@everyone').map(r => `${r}`).slice(0, 10);
            const rolesAmt = server.roles.cache.filter(r => r.name !== '@everyone').size;
            const guildId = server.id;
            let rVal;
            const guilddata = 'data/guilddata.json';
            const gdImport = JSON.parse(fs.readFileSync(guilddata));
            let color;
            if (gdImport[guildId]) {
                if (gdImport[guildId].color == '') {
                    color == 'Blue';
                }
                else { color = gdImport[guildId].color; }
            }
            else { color == 'Blue'; }

            const features = {
                ANIMATED_BANNER: 'Animated Guild Banner',
                ANIMATED_ICON: 'Animated Guild Icon',
                APPLICATION_COMMAND_PERMISSIONS_V2: 'Old Permissions Configuration',
                AUTO_MODERATION: 'Auto-Moderation',
                BANNER: 'Guild Banner',
                COMMUNITY: 'Community Server',
                CREATOR_MONETIZABLE_PROVISIONAL: 'Monetized',
                CREATOR_STORE_PAGE: 'Role Subscription Store',
                DEVELOPER_SUPPORT_SERVER: 'Development Support Server',
                DISCOVERABLE: 'Discoverable in Server Directory',
                FEATURABLE: 'Featured in Server Directory',
                HAS_DIRECTORY_ENTRY: 'Listed in Server Directory',
                HUB: 'Student Hub',
                LINKED_TO_HUB: 'Student Hub Link',
                INVITE_SPLASH: 'Invite Splash Screen',
                WELCOME_SCREEN_ENABLED: 'Welcome Screen',
                INVITES_DISABLED: '',
                MEMBER_VERIFICATION_GATE_ENABLED: 'Membership Screening',
                MORE_STICKERS: 'Expanded Sticker Count',
                NEWS: 'News Channel',
                PARTNERED: 'Partnered Server',
                VERIFIED: 'Verified Server',
                PREVIEW_ENABLED: 'Previewable',
                PRIVATE_THREADS: 'Private Threads Access',
                VANITY_URL: 'Vanity URL',
                ROLE_SUBSCRIPTIONS_ENABLED: '',
                ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE: '',
                ROLE_ICONS: 'Role Icons',
                RAID_ALERTS_DISABLED: '',
                SOUNDBOARD: 'Soundboard',
                GUILD_ONBOARDING: 'Guild Onboarding',
                THREADS_ENABLED: 'Threads',
            };
            const sFeatures = server.features.map(feature => features[feature]).filter(feature => feature !== undefined, feature => feature !== '').join(', ');

            // changes the appearance of roles depending on how many there are (if over 10, displays over 10)
            if (rolesAmt <= 10) {
                rVal = `${roles.join(', ')}`;
            }
            else {
                rVal = `${roles.join(', ')}... and ${rolesAmt - 10} more`;
            }

            // setting up the embed
            infoEmbed
                .setTitle(serverName)
                .setColor(color ?? 'Blue')
                .setDescription(`${server.description ?? 'No description available for this server...'}`)
                .setThumbnail(serverIcon)
                .addFields(
                    { name: 'Owner:', value: `<@${server.ownerId}>`, inline: true },
                    { name: 'Created:', value: `${moment.utc(server.createdAt).format('MMM Do, YYYY hh:mm A')} UTC (${moment.utc(server.createdAt).fromNow()})`, inline: true },
                    { name: `Roles [${rolesAmt}]:`, value: rVal },
                    { name: 'Channels:', value: `Total: ${textChannelAmount + voiceChannelAmount} \nText Channels: ${textChannelAmount} \nVoice Channels: ${voiceChannelAmount}`, inline: true },
                    { name: 'Members:', value: `Total: ${server.memberCount} \nHumans: ${humanCount} \nBots: ${botCount}`, inline: true },
                    { name: 'Features:', value: `${sFeatures.length ? sFeatures : 'No features'}` },
                )
                .setFooter({ text: `ID: ${server.id}` });

            interaction.reply({ embeds: [infoEmbed] });

        }

        if (subcommand === 'bot') {
            // fetched bot info
            const botConfig = JSON.parse(fs.readFileSync('config.json'));
            const file = new AttachmentBuilder('./images/Prizmo_i-white.png');

            const addButton = new ButtonBuilder()
                .setLabel('Add to your own server!')
                .setStyle(ButtonStyle.Link)
                .setURL(link);

            const trelloButton = new ButtonBuilder()
                .setLabel('Trello Page')
                .setStyle(ButtonStyle.Link)
                .setURL('https://trello.com/b/bGNCDIGQ');

            const gitButton = new ButtonBuilder()
                .setLabel('Github Repository')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/kazumikascadia/Prizmo365');

            const row = new ActionRowBuilder()
                .addComponents(addButton, trelloButton, gitButton);

            // embed setup
            infoEmbed
                .setTitle('Prizmo365 Information')
                .setColor('#17ac86')
                .setThumbnail('attachment://Prizmo_i-white.png')
                .setDescription('**Prizmo365** is a work in progress Discord.js bot built with a multipurpose mindset. It is currently in an open beta build, meaning that it is fully available to the public in an incomplete state.\n\nBest of all, Prizmo is **completely free** and **entirely open-source**. You can find all of Prizmo\'s code in its Github repository, and you are completely free to use all of it. Furthermore, once the bot is released, there are no current plans for monetization. Donations will, however, always be accepted, but are not currently open.\n\nPrizmo365 - meant for 365 days a year usage.')
                .addFields(
                    { name: 'Credits:', value: '**Creator**: <@306372629650997260> ([Github](https://github.com/kazumikascadia))\n**Artist**: <@526864658234212352>\n**Contributors**: <@412750725689376779> ([Github](https://github.com/StariaRose)), <@332645535695634455> ([Github](https://github.com/fekie))' },
                    { name: 'Version:', value: `${botConfig.version} (open beta)`, inline: true },
                    { name: 'Used In:', value: `${client.guilds.cache.size} servers`, inline: true },
                )
                .setFooter({ text: 'ID: 734214062627356683' }),

                interaction.reply({ embeds: [infoEmbed], files: [file], components: [row] });

        }
    },
};