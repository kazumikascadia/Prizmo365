const { ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, Client, GatewayIntentBits, AttachmentBuilder, ContextMenuCommandBuilder, ApplicationCommandType, Application } = require('discord.js');
const moment = require('moment'), fs = require('fs');
const { token, link } = require('../../config.json');

function gatherBaseInfo(interaction) {
    const iUser = interaction.user;
    const nickname = iUser.nickname ?? iUser.displayName;
    const avatar = iUser.displayAvatarURL();

    const infoEmbed = new EmbedBuilder()
        .setAuthor({ name: nickname, iconURL: avatar })
        .setTimestamp(+new Date());

    return infoEmbed;
}

async function gatherUserInfo(interaction) {
    const server = await interaction.guild.fetch();
    const tUser = await interaction.options.getUser('target').fetch(true) ?? interaction.fetch();
    const uid = tUser.id;
    const gUser = server.members.cache.get(uid);
    // find all of the roles of the selected user, then map and join them together in a string (all excluding @everyone)
    // create a new variable just for the length of the roles string
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
    // create a dictionary for all user presences; specifically, this will differentiate if the user is offline or just hidden
    const statuses = {
        online: 'Online',
        idle: 'Idle',
        dnd: 'Do Not Disturb',
        offline: 'Invisible',
        off: 'Offline',
    };
    function gatherRoles() {
        let roles = gUser.roles.cache.filter(r => r.name !== '@everyone').map(r => `${r}`).join(', ');
        let rLength = roles.split(', ').length;
        if (`${roles}` == '') {
            roles = 'No roles';
            rLength = '0';
        }

        return {
            roles: roles,
            length: rLength,
        };
    }

    let name;
    // if the user is NOT a bot, set the title to just be their username
    if (!tUser.bot) {
        name = tUser.username;
    }
    // if the user is a bot, add a bot tag to the title
    else {
        name = tUser.username + ' [BOT]';
    }

    // return an array of the userInfo
    const tUI = {
        name: name,
        uid: uid,
        gUser: gUser,
        status: statuses[gUser.presence ? gUser.presence.status : 'off'],
        uFlags: tUser.flags.toArray(),
        flags: flags,
        roles: gatherRoles().roles,
        rolesLength: gatherRoles().length,
        accentColor: tUser.hexAccentColor,
        mavatar: tUser.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }) ?? tUser.defaultAvatarURL({ dynamic: true, size: 960, format: 'png' }),
    };
    return tUI;
}

async function generateUserInfoEmbed(interaction, server) {
    const tUser = await interaction.options.getUser('target').fetch(true) ?? interaction.fetch();
    const tUI = await gatherUserInfo(interaction);
    const infoEmbed = gatherBaseInfo(interaction)
        .setTitle(tUI.name)
        .setDescription(`Known as ${tUser}; currently set to ${tUI.status}`)
        .addFields(
            { name: `Roles [${tUI.rolesLength}]:`, value: tUI.roles ?? 'No roles' },
            { name: 'Flags:', value: `${tUI.uFlags.length ? tUI.uFlags.map(flag => tUI.flags[flag]).join(', ') : 'None'}` },
            { name: 'Joined Discord:', value: `${moment.utc(tUser.createdAt).format('MMM Do, YYYY hh:mm A')} UTC (${moment.utc(tUser.createdAt).fromNow()})`, inline: true },
            { name: 'Joined Server:', value: `${moment.utc(tUI.gUser.joinedAt).format('MMM Do, YYYY hh:mm A')} UTC (${moment.utc(tUI.gUser.joinedAt).fromNow()})`, inline: true },
        )
        .setColor(tUI.accentColor)
        .setThumbnail(tUI.mavatar)
        .setFooter({ text: `ID: ${tUI.uid}` });

    interaction.reply({ embeds: [infoEmbed] });
}

async function gatherServerInfo(interaction) {
    // fetched server information
    const server = await interaction.guild.fetch();
    const guildId = server.id;
    const guilddata = 'data/guilddata.json', gdImport = JSON.parse(fs.readFileSync(guilddata));
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

    // changes the appearance of roles depending on how many there are (if over 10, displays over 10)
    const roles = server.roles.cache.filter(r => r.name !== '@everyone').map(r => `${r}`).slice(0, 10);
    const rolesAmt = server.roles.cache.filter(r => r.name !== '@everyone').size;
    let rVal;
    if (rolesAmt <= 10) {
        rVal = `${roles.join(', ')}`;
    }
    else {
        rVal = `${roles.join(', ')}... and ${rolesAmt - 10} more`;
    }

    const sI = {
        name: server.name,
        id: server.id,
        ownerId: server.ownerId,
        createdAt: server.createdAt,
        icon: server.iconURL({ dynamic: true, size: 1024, format: 'png' }) ?? interaction.user.defaultAvatarURL,
        color: color,
        features: server.features.map(feature => features[feature]).filter(feature => feature !== undefined, feature => feature !== '').join(', '),
        roles: rVal,
        rolesAmount: server.roles.cache.filter(r => r.name !== '@everyone').size,
        cAmount: server.channels.cache.size,
        catAmount: server.channels.cache.filter(c => c.type === 4).size,
        vcAmount: server.channels.cache.filter(c => c.type === 2).size,
        tcAmount: server.channels.cache.filter(c => c.type === 0).size,
        fcAmount: server.channels.cache.filter(c => c.type === 15).size,
        memberCount: server.members.cache.size,
        humanCount: server.members.cache.filter(m => !m.user.bot).size,
        botCount: server.members.cache.filter(m => m.user.bot).size,
    };

    return sI;
}

async function generateServerInfoEmbed(interaction) {
    // Gather info for the server by utilizing a prior function.
    const sI = await gatherServerInfo(interaction);
    console.log(sI);

    // Gather base info and create information embed.
    // This embed utilizes information from the previously gathered server info.
    const infoEmbed = await gatherBaseInfo(interaction)
        .setTitle(sI.name)
        .setColor(sI.color ?? 'Blue')
        .setDescription(`${sI.description ?? 'No description available for this server...'}`)
        .setThumbnail(sI.icon)
        .addFields(
            { name: 'Owner:', value: `<@${sI.ownerId}>`, inline: true },
            { name: 'Created:', value: `${moment.utc(sI.createdAt).format('MMM Do, YYYY hh:mm A')} UTC (${moment.utc(sI.createdAt).fromNow()})`, inline: true },
            { name: `Roles [${sI.rolesAmount}]:`, value: sI.roles },
            { name: 'Channels:', value: `Total: ${sI.cAmount}\nCategories: ${sI.catAmount}\nText Channels: ${sI.tcAmount}\nVoice Channels: ${sI.vcAmount}\nForum Channels: ${sI.fcAmount}`, inline: true },
            { name: 'Members:', value: `Total: ${sI.memberCount}\nHumans: ${sI.humanCount}\nBots: ${sI.botCount}`, inline: true },
            { name: 'Features:', value: `${sI.features.length ? sI.features : 'No features'}` },
        )
        .setFooter({ text: `ID: ${sI.id}` });

    interaction.reply({ embeds: [infoEmbed] });
}

function generateBotInfoEmbed(interaction, client) {
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
    const infoEmbed = gatherBaseInfo(interaction)
        .setTitle('Prizmo365 Information')
        .setColor('#17ac86')
        .setThumbnail('attachment://Prizmo_i-white.png')
        .setDescription('**Prizmo365** is a work in progress Discord.js bot built with a multipurpose mindset. It is currently in an open beta build, meaning that it is fully available to the public in an incomplete state.\n\nBest of all, Prizmo is **completely free** and **entirely open-source**. You can find all of Prizmo\'s code in its Github repository, and you are completely free to use all of it. Furthermore, once the bot is released, there are no current plans for monetization.\n\nPrizmo365 - meant for 365 days a year usage.')
        .addFields(
            { name: 'Credits:', value: '**Creator**: <@306372629650997260> ([Github](https://github.com/kazumikascadia))\n**Artist**: <@526864658234212352>\n**Contributors**: <@412750725689376779> ([Github](https://github.com/StariaRose)), <@332645535695634455> ([Github](https://github.com/fekie))' },
            { name: 'Version:', value: `${botConfig.version} (open beta)`, inline: true },
            { name: 'Used In:', value: `${client.guilds.cache.size} servers`, inline: true },
        )
        .setFooter({ text: 'ID: 734214062627356683' });

    interaction.reply({ embeds: [infoEmbed], files: [file], components: [row] });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides info on the chosen object.')
        .setDMPermission(false)
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
        const server = interaction.guild;

        // login again and grab all guilds, then fetching their memberbase
        // this keeps the info commands up to date, so that they will always display CURRENT information
        await client.login(token).then(client.guilds.fetch()).then(server.fetch()).then(server.members.fetch());

        // grab the used subcommand and set up the embed with just two info variables
        const subcommand = interaction.options.getSubcommand();
        // checks what subcommand was used
        switch (subcommand) {
            case 'user':
                generateUserInfoEmbed(interaction);
                break;
            case 'server':
                generateServerInfoEmbed(interaction);
                break;
            case 'bot':
                generateBotInfoEmbed(interaction, client);
                break;
        }
    },
};