/*
 * Copyright (c) 2025 solarcosmic.
 * This project is licensed under the MIT license.
 * To view the license, see <https://opensource.org/licenses/MIT>.
*/
// This was written before I knew much about discord.js.
const { Client, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require("dotenv").config(); // prepare .env
const token = process.env.CLIENT_TOKEN; // get the token from env file

// Set required intents to make the bot work. I don't know why it needs this many but ok
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    client.user.setStatus("idle");
});

var prompt = "[ONLY In Language: English (United Kingdom)] Please explain this thoroughly in 1-2 sentences, only the explanation: ";
function sendAIRequest(content, callback) {
    fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
                "messages": [{"role": "user", "content": prompt + content}]
        })
    })
    .then(response => response.json())
    .then(data => {
        callback(data["choices"][0]["message"]["content"].split("</think>").pop());
    });
}

/* 
 * A function to respond to the user's message.
 * It gets the reply from the ping and does stuff with it.
*/
async function respond(message) {
    try {
        const messageReplied = await message.channel.messages.fetch(message.reference.messageId);
        const channel = message.channel;
        channel.sendTyping();
        sendAIRequest(messageReplied.content, (response) => {
            const regen = new ButtonBuilder()
                .setCustomId(`regenerate:${messageReplied.id}`)
                .setLabel('⟳')
                .setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder()
                .addComponents(regen);
            const embed = {
                color: 0x808080,
                description: response,
                footer: {
                    text: "May include mistakes. Please check responses before using."
                }
            }
            message.reply( {embeds: [embed], components: [row]} );
        });
    } catch (error) {
        console.error("Error fetching replied message: " + error);
    }
}

client.on("messageCreate", async (message) => {
    if (message.mentions.users.has(client.user.id) && !message.author.bot) {
        if (message.type == "REPLY" || message.type == 19) {
            if (!message.reference) return;
            respond(message);
        } else {
            const embed = {
                color: 0xff8787,
                description: "Uh oh! Can't find the message you want me to explain. Please reply to a message and ping me!",
            }
            message.reply( {embeds: [embed]} );
        }
        return;
    }
});

/*
 * Determines if the button (regenerate) gets pressed.
 * This will re-trigger the prompt making (assuming it works)
*/
client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith('regenerate:')) {
            const originalMsgId = interaction.customId.split(':')[1];
            try {
                const inter_embed = {
                    color: 0x202020,
                    description: "Regenerating...",
                }
                await interaction.message.edit({ embeds: [inter_embed]});
                const originalMsg = await interaction.channel.messages.fetch(originalMsgId);
                
                await interaction.deferUpdate();

                sendAIRequest(originalMsg.content, async (response) => {
                    const regen = new ButtonBuilder()
                        .setCustomId(`regenerate:${originalMsgId}`)
                        .setLabel('⟳')
                        .setStyle(ButtonStyle.Secondary);
                    const row = new ActionRowBuilder()
                        .addComponents(regen);
                    const embed = {
                        color: 0x808080,
                        description: response,
                        footer: {
                            text: "May include mistakes. Please check responses before using."
                        }
                    }
                    await interaction.message.edit({ embeds: [embed], components: [row] });
                });
            } catch (error) {
                console.error("Error regenerating response: " + error);
            }
        }
    }
})

client.login(token);