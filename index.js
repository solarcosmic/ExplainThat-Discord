const { Client, Events, GatewayIntentBits } = require('discord.js');
require("dotenv").config();
const token = process.env.CLIENT_TOKEN;

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
        callback(data["choices"][0]["message"]["content"]);
    });
}

client.on("messageCreate", async (message) => {
    if (message.mentions.users.has(client.user.id) && !message.author.bot) {
        if (message.type == "REPLY" || message.type == 19) {
            if (!message.reference) return;
            try {
                const messageReplied = await message.channel.messages.fetch(message.reference.messageId);
                const channel = message.channel;
                channel.sendTyping();
                sendAIRequest(messageReplied.content, (response) => {
                    const embed = {
                        color: 0x808080,
                        description: response,
                        footer: {
                            text: "May include mistakes. Please check responses before using."
                        }
                    }
                    message.reply( {embeds: [embed]} );
                });
            } catch (error) {
                console.error("Error fetching replied message: " + error);
            }
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

client.login(token);