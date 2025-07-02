const { Client, Events, GatewayIntentBits } = require('discord.js');
require("dotenv").config();
const token = process.env.CLIENT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.mentions.users.has(client.user.id) && !message.author.bot) {
        console.log("message received, type: " + message.type);
        if (message.type == "REPLY" || message.type == 19) {
            console.log("message is type");
            if (!message.reference) return;
            try {
                console.log("try block attempt");
                const messageReplied = await message.channel.messages.fetch(message.reference.messageId);
                const channel = message.channel;
                channel.sendTyping();
                fetch("https://ai.hackclub.com/chat/completions", {
                    method: "POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                            "messages": [{"role": "user", "content": "[ONLY In Language: English (United Kingdom)] Please explain this thoroughly in 1-2 sentences, only the explanation: " + messageReplied.content}]
                    })
                })
                .then(response => response.json())
                .then(data => {
                    const embed = {
                        color: 0x001a2a,
                        description: data["choices"][0]["message"]["content"],
                        footer: {
                            text: "May include mistakes. Please check responses before using."
                        }
                    }
                    message.reply( {embeds: [embed]} );
                });
            } catch (error) {
                console.error("Error fetching replied message: " + error);
            }
        }
        return;
    }
});

client.login(token);