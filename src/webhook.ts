// const Discord = require('discord.js')
const { EmbedBuilder, WebhookClient } = require('discord.js');
require('dotenv').config();

export default class WebHook {

    public webhookClient: any
    public embed: any

    constructor() {

        this.webhookClient = new WebhookClient({ id: process.env.DISCORD_ID, token: process.env.DISCORD_TOKEN })
    }

    send(action: String, title: String, link: String) {

        if(link.length > 0) {
            this.embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(action)
            .setDescription(title)
            .setURL(link)
            .setTimestamp()
            .setFooter({ text: 'Have fun !', iconURL: 'https://i.imgur.com/o77nF0S.jpg' });
        } else {
            this.embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(action)
            .setDescription(title)
            .setTimestamp()
            .setFooter({ text: 'Have fun !', iconURL: 'https://i.imgur.com/o77nF0S.jpg' });
        }



        this.webhookClient.send({
            // content: '',
            username: 'Bob le bot 2',
            avatarURL: 'https://i.imgur.com/o77nF0S.jpg',
            embeds: [this.embed],
        });
    }


}
