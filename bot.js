const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers // Required for managing roles
    ]
});

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Command to trigger the embed message
    if (message.content === '!embed') {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('**GROUP RULES AND GUIDELINES**')
            .setDescription(`
**Non-compliance with these rules may result in disciplinary action.**

1. **USE APPROPRIATE CHANNELS**  
Please ensure that all discussions and posts are made within the designated channels.

2. **ADHERE TO ASSIGNED ROLES**  
Respect and follow the responsibilities associated with your assigned role.

3. **NO SPAMMING**  
Refrain from sending repetitive or irrelevant messages to maintain a productive environment.

4. **NO SELF-PROMOTION WITHOUT PRIOR APPROVAL**  
Personal promotions or advertisements require prior authorization.

5. **AVOID UNDERMINING OTHERS' CONTRIBUTIONS**  
Please refrain from making comparisons that could imply your contributions exceed those of others.
`);

        // Replace 'YOUR_CHANNEL_ID' with the actual channel ID
        const channelId = '1227294867328208939';
        const channel = client.channels.cache.get(channelId);

        if (channel) {
            channel.send({ embeds: [embed] })
                .then(() => console.log('Embed sent successfully!'))
                .catch(err => console.log('Error sending embed:', err));
        } else {
            console.log('Channel not found!');
        }
    }

    // Self-role system: !role <role_name>
    if (message.content.startsWith('!role')) {
        // Split the command to get the role name
        const args = message.content.split(' ').slice(1);
        const roleName = args.join(' '); // Join the args to form the full role name

        if (!roleName) {
            return message.reply('Please specify a role name.');
        }

        // Get the role from the guild
        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());

        if (!role) {
            return message.reply('That role does not exist.');
        }

        // Check if the bot has permission to manage roles
        if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
            return message.reply('I don\'t have permission to manage roles.');
        }

        // Check if the user has a higher role than the one they're trying to assign
        if (message.member.roles.highest.position <= role.position) {
            return message.reply('You cannot assign yourself a role higher than or equal to your own role.');
        }

        try {
            // Assign the role to the user
            await message.member.roles.add(role);
            message.reply(`You have been given the ${role.name} role.`);
        } catch (err) {
            console.error(err);
            message.reply('There was an error assigning the role.');
        }
    }
});

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login('MTMwNjcyMTMxMzUxOTU3MTA1NA.GjX34_.NsubrBslphrpElq44HseAkkfFKEImy51Ohm1ko');
