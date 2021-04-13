const fs = require('fs')
const _ = require('lodash');
const request = require('request');
const Discord = require('discord.js');
const discordClient = new Discord.Client();

let config = {}
if (fs.existsSync('./config.json')) {
    config = require('./config.json');
}

const discordToken = process.env.DISCORDTOKEN || config.discordToken;
const discordChannelID = process.env.DISCORDCHANNELID || config.discordChannelID;
const apiUrl = process.env.SAUERTRACKERAPIURL || config.sauertrackerApiUrl;

let lastResp = [];

function update() {
    request(apiUrl, function (error, response, body) {
        if (error || !response || response.statusCode !== 200) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            return;
        }
        let resp = JSON.parse(body);
        let newGames = [];
        if (lastResp.length) newGames = _.orderBy(_.differenceBy(resp.results, lastResp, 'id'), ['id', 'desc']);
        lastResp = resp.results;
        for (let i in newGames) {
            let game = newGames[i];
            game.meta = game.meta || [];
            let description = `${game.serverdesc}: **${game.meta[2]}** def. **${game.meta[0]}** (${game.meta[3]} - ${game.meta[1]}, ${game.map} ${game.gamemode})`;
            let messageURL = `https://sauertracker.net/game/${game.id}`;
            let authorName = 'Game Ended';
            let authorURL = `https://sauertracker.net/game/${game.id}`;
            
            const channel = discordClient.channels.find('id', discordChannelID);
            const embed = { type: "rich", description, color: 0x4d8e1b };
            if (messageURL) embed.url = messageURL;
            if (authorName) {
                embed.author = { name: authorName };
                if (authorURL) embed.author.url = authorURL;
            }
            channel.send({ embed });
        }
    });
}

discordClient.on('ready', () => {
    console.log('I am ready!');
    setInterval(update, 60000);
    update();
});

let usageErrorMsg = 'usage error. Correct syntax is `.deletesince [msg_id]`';

discordClient.on('message', msg => {
    if (msg.content.startsWith('.deleteafter')) {
        parts = msg.content.split(' ');
        if (parts.length < 2) {
            msg.reply(usageErrorMsg);
            return;
        }
        msgid = parts[1];
        if (!msgid) {
            msg.reply(usageErrorMsg);
            return;
        }
        msg.channel.fetchMessages({after: msgid})
            .then(messages => {
                messages.forEach((value, key) => {
                    value.delete();
                });
            })
            .catch(error => {
                msg.reply(error.toString());
            });
    }
});

discordClient.login(discordToken);
