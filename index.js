const _ = require('lodash');
const request = require('request');
const Discord = require('discord.js');
const discordClient = new Discord.Client();

const config = require('./config.json');

const discordToken = config.discordToken;
const discordChannelID = config.discordChannelID;
const apiUrl = config.sauertrackerApiUrl;

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
            let description = `${game.serverdesc}: **${game.meta[2]}** def. **${game.meta[0]}** (*${game.meta[3]}* - *${game.meta[1]}*)`;
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
    setInterval(update, 5000);
    update();
});

discordClient.login(discordToken);
