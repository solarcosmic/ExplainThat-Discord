# ExplainThat-Discord
"Select any text on a webpage and have AI explain it for you" as a Discord bot.

Based on my original project for Chrome: [ExplainThat](https://github.com/solarcosmic/ExplainThat).

## How does this bot work?
It uses an API provided by Hack Club to generate a response based on the information given. It checks through the reply to see what message has been replied to, and explains it accordingly using [ai.hackclub.com](https://ai.hackclub.com).

## How can I install ExplainThat?
You can install ExplainThat as a Discord bot [here](https://discord.com/oauth2/authorize?client_id=1389846829889359974&permissions=2048&integration_type=0&scope=bot), but if you want to run the Discord bot locally:

Prerequisite: Make sure you have Node.js and npm installed. [Download here](https://nodejs.org/en/download).
1. Clone the GitHub repository, or download the .zip file (source code) from the latest release [here](https://github.com/solarcosmic/ExplainThat/releases/latest/).
2. Rename .env.example to .env
3. Open a terminal or Command Prompt inside that location, then run `npm i`.
4. Paste in your Client Token into the .env after the `=`, where it says: `CLIENT_TOKEN=`
(To get your Bot's Client Token, you need to create a Discord bot. Refer to [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) if you need help.)
5. Invite your Discord bot to your Discord server. ExplainThat! only requires the `bot` scope and the `Send Messages` permission. Refer to [here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html) if you need help.
6. In that same terminal (or just a Command Prompt within that same location), you can run `node index.js` to run the Discord bot.
7. Have fun! Reply to a message while pinging `@ExplainThat` to get a result.