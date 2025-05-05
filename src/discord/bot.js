const { Client, GatewayIntentBits } = require('discord.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const ROLE_ID = '1366018215934820414';
const LOG_CHANNEL_ID = '1366594450184343562';

client.once('ready', () => {
    console.log(`The bot ${client.user.tag} turned on and working.`);
});

client.on('guildMemberAdd', async (member) => {
    try {
        const role = member.guild.roles.cache.get(ROLE_ID);

        if (!role) {
            console.log(`The role with ID ${ROLE_ID} not found on server ${member.guild.name}`);
            return;
        }

        await member.roles.add(role);
        console.log(`The role ${role.name} issued to the user ${member.user.tag}`);
    } catch (error) {
        console.error(`Error while issuing role: ${error}`);
    }
});


client.on('voiceStateUpdate', async (oldState, newState) => {
    try {
        const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);

        if (!logChannel) {
            console.log(`Log channel with ID ${LOG_CHANNEL_ID} not found`);
            return;
        }

        const member = newState.member || oldState.member;
        const userMention = `<@${member.id}>`;


        if (!oldState.channel && newState.channel) {
            await logChannel.send(`${userMention}  joined voice channel  \`${newState.channel.name}\``);
            console.log(`${userMention}  joined voice channel  \`${newState.channel.name}\``);
        }

        else if (oldState.channel && !newState.channel) {
            await logChannel.send(`${userMention}  left voice channel  \`${oldState.channel.name}\``);
            console.log(`${userMention}  left voice channel  \`${oldState.channel.name}\``);
        }

        else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            await logChannel.send(`${userMention}  switched from  \`${oldState.channel.name}\`  to  \`${newState.channel.name}\``);
            console.log(`${userMention}  switched from  \`${oldState.channel.name}\`  to  \`${newState.channel.name}\``);
        }
    } catch (error) {
        console.error(`Error while logging voice state: ${error}`);
    }
});

client.login(process.env.DISCORD_TOKEN);