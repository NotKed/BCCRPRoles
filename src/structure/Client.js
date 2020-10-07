const {
    Client,
    Collection,
    MessageEmbed
} = require('discord.js');
const logger = require('./Logger');
const updater = require('./Updater');
const { readdirSync } = require('fs');

class DiscordClient extends Client {

    constructor(options) {
        super(options);
        this.logger = logger;
        this.updater = updater;
        this.config = require('../../config.json')
        this.commands = new Collection();

        this.on("ready", () => {
            logger.log(`${this.user.username}, Ready to serve ${this.users.cache.size} users in ${this.guilds.cache.size} guilds.`);
            this.loadActions();
        });

        this.on("message", async (message) => {
            if(message.author.bot) return;
            if(!message.content.startsWith(this.config.discordPrefix)) return;
            if(!message.content) return;

            const args = message.content.slice(this.config.discordPrefix.length).trim().split(" ");
            let command = this.commands.get(args[0].toLowerCase());
            if(command) {
                try {

                    let permLevel = [0];
                    if (message.member.hasPermission('MANAGE_MESSAGES')) permLevel.push(1);
                    if (message.member.hasPermission('MANAGE_ROLES')) permLevel.push(2);
                    if (message.member.hasPermission('KICK_MEMBERS')) permLevel.push(3);
                    if (message.member.hasPermission('BAN_MEMBERS')) permLevel.push(4);
                    if (message.member.hasPermission('ADMINISTRATOR')) permLevel.push(5);

                    if (permLevel.includes(command.config.permLevel)) {
                        command.run(message, args.slice(1), this);
                        logger.log(`${message.author.tag} (${message.author.id}) just ran ${args[0].toLowerCase()}.js in ${message.guild.name} (${message.guild.id})`);
                    } else {
                        const embed = new MessageEmbed()
                            .setColor('RED')
                            .setAuthor(message.author.username, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`)
                            .setDescription(`<:x_:667537288661565468> You aren't authorized to run this command!`)
                        message.channel.send(embed); 
                        logger.log(`${message.author.tag} (${message.author.id}) attempted to run ${args[0].toLowerCase()}.js in ${message.guild.name} (${message.guild.id}) but didn't have the specified permissions.`);
                    };

                } catch (error) {
                    const embed = new MessageEmbed()
                        .setColor('RED')
                        .setAuthor(message.author.username, `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`)
                        .setDescription(`It seems I have ran into an error! Please contact the developer.`)
                    msg.channel.send(embed);
                }
            }
        })

        this.on("messageReactionAdd", async (reaction, user) => {
            let event = new (require('../bot/events/ReactionAdded'))(this);
            event.run(reaction, user, this);
        });

        this.modules = {};
        this.modules.MessageEmbed = MessageEmbed;

        this.login(this.config.discordToken);
    }

    loadActions() {
        for (let file of readdirSync(`./src/bot/commands/`).filter(file => file.endsWith(".js"))) {
            const command = new (require(`../bot/commands/${file}`))(this);
            this.commands.set(command.help.name, command);
            logger.log(`${this.user.username} just loaded ${file}`);
            for (let alias of command.config.aliases) {
                this.commands.set(alias, command);
            };
        };
    }

}

module.exports = DiscordClient;