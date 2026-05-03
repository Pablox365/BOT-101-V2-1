const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.GuildMember]
});

// CONFIGURACIÓN
const CONFIG = {
    GUILD_ID: "1492989457694064804",
    CHANNEL_ID: "1500556875148689722",
    INVITES: {
        "HzYkWc2VZJ": "WARBORN 🔥"
    }
};

let invites = new Map();

client.once('ready', async () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);

    const guild = await client.guilds.fetch(CONFIG.GUILD_ID);
    const guildInvites = await guild.invites.fetch();

    guildInvites.forEach(inv => {
        invites.set(inv.code, inv.uses);
    });

    console.log("📊 Invitaciones cargadas");
});

client.on('guildMemberAdd', async (member) => {
    try {
        const newInvites = await member.guild.invites.fetch();
        let usedInvite = null;

        newInvites.forEach(inv => {
            const oldUses = invites.get(inv.code) || 0;

            if (inv.uses > oldUses) {
                usedInvite = inv;
            }

            invites.set(inv.code, inv.uses);
        });

        const canal = member.guild.channels.cache.get(CONFIG.CHANNEL_ID);

        if (!canal) return;

        if (usedInvite) {
            const nombre = CONFIG.INVITES[usedInvite.code] || usedInvite.code;

            canal.send(`🟢 **${member.user.tag}** se unió desde **${nombre}**`);
        } else {
            canal.send(`🟡 **${member.user.tag}** se unió pero no se pudo detectar el link`);
        }

    } catch (error) {
        console.error("Error:", error);
    }
});

client.login("MTUwMDU1MjQ3ODI2ODMyNTk5OQ.GHoqiv.-NZzx0OBdp26HUj1dJo4vFioJ2u82TBtaOPG8A");