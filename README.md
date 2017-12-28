# Discord Bot

Simple bot that prints game results on Discord based on a SauerTracker query.

## Installation

You must have Git and Node.js installed. Run the following commands:

```
git clone https://github.com/sauerduels/discord-bot.git
cd discord-bot
npm install
```

## Configuration

Copy *config.default.json* to *config.json* and open it in a text editor. Here you can change the following configuration options:

- **discordToken**: The Discord bot token. One can obtained by following [this guide](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).
- **discordChannelID**: The ID of the channel where the bot shall print its messages. It can be obtained by right clicking on a Discord channel and selecting *Copy ID*.
- **sauertrackerApiUrl**: The SauertTracker query URL. For example, `http://sauertracker.net/api/games/find?gametype=duel&serverdesc=something` will find duels played on a server whose description contains *something*.

## Running

Run the following command (use screen or tmux in order to create a persistent session):

```
node main.js
```
