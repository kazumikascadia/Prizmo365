const { EmbedBuilder, Client, GatewayIntentBits, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const moment = require('moment'), fs = require('fs');
const { token, link } = require('../../config.json');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('User Information')
        .setType(ApplicationCommandType.User),
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
        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: nickname, iconURL: avatar })
            .setTimestamp(+new Date());
        // login again and grab all guilds, then fetching their memberbase
        // this keeps the info commands up to date, so that they will always display CURRENT information
        await client.login(token).then(client.guilds.fetch()).then(server.fetch()).then(server.members.fetch());

        // fetches user information on the desired target; if no target, use the interaction user
        // since this command requires a target, it will always have a selected target (subject to change)
        // this section grabs the targets id, avatar, their place in the current guild, their accent hex color, and their guild roles
        const mUser = await server.members.cache.get(interaction.targetId).user.fetch(true) || iUser.fetch(true);
        const uid = mUser.id;
        const mavatar = mUser.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }) ?? mUser.defaultAvatarURL({ dynamic: true, size: 960, format: 'png' });
        const gUser = server.members.cache.get(uid);
        const accentColor = mUser.hexAccentColor || 'Green';
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

        interaction.reply({ embeds: [infoEmbed] });

    },
};